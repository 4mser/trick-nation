import React, { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl, { Marker } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import api from '@/services/api';
import { useAuth } from '@/context/auth-context';
import TotemFormModal from './TotemFormModal';
import TotemDetailModal from './TotemDetailModal';
import { Totem } from "@/types/totem";
import { Pin } from "@/types/pins";
import PinFormDrawer from "./PinFormDrawer";
import PinDetailModal from "./PinDetailModal";
import TotemFilterDrawer from './TotemFilterDrawer';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
const EXPLORATION_RADIUS_METERS = 100;

const Map: React.FC = () => {
  const { user } = useAuth();
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const mapNode = useRef<HTMLDivElement | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const [pins, setPins] = useState<Pin[]>([]);
  const [totems, setTotems] = useState<Totem[]>([]);
  const [showTotemForm, setShowTotemForm] = useState(false);
  const [isDebugMode, setIsDebugMode] = useState(false);
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const [selectedTotem, setSelectedTotem] = useState<Totem | null>(null);
  const totemMarkersRef = useRef<{ [id: string]: mapboxgl.Marker }>({});

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera();
  const clock = new THREE.Clock();
  let mixer: THREE.AnimationMixer | null = null;
  let renderer: THREE.WebGLRenderer;

  const createMarkerElement = useCallback(() => {
    const markerElement = document.createElement('div');
    markerElement.className = 'custom-marker';
    markerElement.style.width = '18px';
    markerElement.style.height = '18px';
    markerElement.style.borderRadius = '50%';
    markerElement.style.backgroundColor = 'rgb(234, 179, 8)';
    return markerElement;
  }, []);

  const createGeoJSONCircle = (center: [number, number], radiusInMeters: number) => {
    const points = 64;
    const coords = {
      latitude: center[1],
      longitude: center[0],
    };
    const km = radiusInMeters / 1000;
    const ret = [];
    const distanceX = km / (111.32 * Math.cos((coords.latitude * Math.PI) / 180));
    const distanceY = km / 110.574;

    let theta, x, y;
    for (let i = 0; i < points; i++) {
      theta = (i / points) * (2 * Math.PI);
      x = distanceX * Math.cos(theta);
      y = distanceY * Math.sin(theta);

      ret.push([coords.longitude + x, coords.latitude + y]);
    }
    ret.push(ret[0]);

    return {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [ret],
      },
      properties: {},
    } as GeoJSON.Feature<GeoJSON.Polygon>;
  };

  const addExplorationCircleToMap = (map: mapboxgl.Map, center: [number, number], radius: number) => {
    const circleData = createGeoJSONCircle(center, radius);

    if (map.getSource('exploration-circle')) {
      const source = map.getSource('exploration-circle') as mapboxgl.GeoJSONSource;
      source.setData(circleData);
    } else {
      map.addSource('exploration-circle', {
        type: 'geojson',
        data: circleData,
      });

      // Añadir el círculo de exploración con un efecto de brillo
      map.addLayer({
        id: 'exploration-circle-layer',
        type: 'fill',
        source: 'exploration-circle',
        layout: {},
        paint: {
          'fill-color': 'rgba(255, 223, 0, 0.5)', // Color dorado más vibrante
          'fill-opacity': 0.9,
        },
      });

      // Añadir un borde brillante al círculo
      map.addLayer({
        id: 'exploration-circle-glow',
        type: 'line',
        source: 'exploration-circle',
        layout: {},
        paint: {
          'line-color': 'rgba(255, 223, 0, 1)', // Color dorado más vibrante
          'line-width': 4,
          'line-opacity': 1,
          'line-blur': 3,
        },
      });
    }
  };

  const createPinMarkerElement = useCallback((pin: Pin) => {
    const markerElement = document.createElement('div');
    markerElement.className = 'pin-marker';
    markerElement.style.width = '25px';
    markerElement.style.height = '25px';
    markerElement.style.borderRadius = '50%';
    markerElement.style.overflow = 'hidden';
    markerElement.style.boxShadow = '0 2px 5px rgba(0,0,0,0.5)';

    const img = document.createElement('img');
    img.src = `${pin.imageUrl || '/default-pin-image.jpg'}`;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.borderRadius = '50%';
    img.style.objectFit = 'cover';

    markerElement.appendChild(img);

    markerElement.addEventListener('click', () => {
      setSelectedPin(pin);
    });

    return markerElement;
  }, []);

  const createTotemMarkerElement = useCallback((totem: Totem) => {
    const markerElement = document.createElement('div');
    markerElement.className = 'totem-marker';
    markerElement.style.width = '50px';
    markerElement.style.height = '50px';
    markerElement.style.borderRadius = '50%';
    markerElement.style.overflow = 'hidden';
    markerElement.style.border = '3px solid rgb(234, 179, 8)';
    markerElement.style.boxShadow = '0 0 5px rgba(0,0,0,0.5)';

    const img = document.createElement('img');
    img.src = `${totem.imageUrl}`;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.borderRadius = '50%';
    img.style.padding = '3px';
    img.style.objectFit = 'cover';

    markerElement.appendChild(img);

    markerElement.addEventListener('click', () => {
      setSelectedTotem(totem);
    });

    return markerElement;
  }, []);

  const centerMapOnUserLocation = useCallback(() => {
    if (map && userLocation) {
      map.flyTo({ center: userLocation as [number, number], zoom: 17 });
    }
  }, [map, userLocation]);

  const handleAddTotem = useCallback(() => {
    if (!userLocation || !user) return;
    setShowTotemForm(true);
  }, [userLocation, user]);

  const updateTotemMarkers = useCallback((filtered: Totem[]) => {
    // Eliminar todos los marcadores actuales de tótems
    Object.values(totemMarkersRef.current).forEach(marker => marker.remove());
    totemMarkersRef.current = {};

    // Agregar los marcadores filtrados
    filtered.forEach(totem => {
      const markerElement = createTotemMarkerElement(totem);
      const marker = new mapboxgl.Marker({
        element: markerElement,
      })
        .setLngLat(totem.location.coordinates as [number, number])
        .addTo(map!);

      totemMarkersRef.current[totem._id] = marker;
    });
  }, [createTotemMarkerElement, map]);

  const handleApplyFilters = useCallback((selectedCategories: string[]) => {
    const filtered = totems.filter(totem =>
      selectedCategories.some(category => totem.categories.includes(category))
    );

    updateTotemMarkers(filtered);
  }, [totems, updateTotemMarkers]);

  const fetchPins = useCallback(async () => {
    try {
      const response = await api.get<Pin[]>('/pins');
      setPins(response.data);
    } catch (error) {
      console.error('Failed to fetch pins:', error);
    }
  }, []);

  const fetchTotems = useCallback(async () => {
    try {
      const response = await api.get<Totem[]>('/totems');
      setTotems(response.data);

      // Crear marcadores de tótems y mantener una referencia a ellos
      updateTotemMarkers(response.data);
    } catch (error) {
      console.error('Failed to fetch totems:', error);
    }
  }, [updateTotemMarkers]);

  const calculateDistance = (location1: [number, number], location2: [number, number]): number => {
    const [lat1, lon1] = location1;
    const [lat2, lon2] = location2;

    const R = 6371e3; // Radio de la fokin tierra en metros
    const φ1 = lat1 * (Math.PI / 180);
    const φ2 = lat2 * (Math.PI / 180);
    const Δφ = (lat2 - lat1) * (Math.PI / 180);
    const Δλ = (lon2 - lon1) * (Math.PI / 180);

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;
    return distance;
  };

  const add3DModelToMap = (map: mapboxgl.Map, modelUrl: string, location: [number, number], totem: Totem) => {
    const modelOrigin = location;
    const modelAltitude = 0;
    const modelRotate = [Math.PI / 2, 0, 0];

    const modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
      modelOrigin,
      modelAltitude
    );

    const modelTransform = {
      translateX: modelAsMercatorCoordinate.x,
      translateY: modelAsMercatorCoordinate.y,
      translateZ: modelAsMercatorCoordinate.z || 0,
      rotateX: modelRotate[0],
      rotateY: modelRotate[1],
      rotateZ: modelRotate[2],
      scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits() * 200,
    };

    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/path/to/draco/gltf/');

    loader.setDRACOLoader(dracoLoader);

    loader.load(modelUrl, (gltf) => {
      const model = gltf.scene;
      mixer = new THREE.AnimationMixer(model);
      gltf.animations.forEach((clip) => {
        mixer?.clipAction(clip).play();
      });

      scene.add(model);

      model.userData = { ...totem }; // Add userData to the model for later reference

      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.userData = { ...totem }; // Add userData to the child mesh
        }
      });
    });

    map.on('render', () => {
      const delta = clock.getDelta();
      if (mixer) mixer.update(delta);

      const rotationX = new THREE.Matrix4().makeRotationAxis(
        new THREE.Vector3(1, 0, 0),
        modelTransform.rotateX
      );
      const rotationY = new THREE.Matrix4().makeRotationAxis(
        new THREE.Vector3(0, 1, 0),
        modelTransform.rotateY
      );
      const rotationZ = new THREE.Matrix4().makeRotationAxis(
        new THREE.Vector3(0, 0, 1),
        modelTransform.rotateZ
      );

      const m = new THREE.Matrix4().fromArray((map as any).transform.customLayerMatrix());
      const l = new THREE.Matrix4()
        .makeTranslation(
          modelTransform.translateX,
          modelTransform.translateY,
          modelTransform.translateZ
        )
        .scale(
          new THREE.Vector3(
            modelTransform.scale,
            -modelTransform.scale,
            modelTransform.scale
          )
        )
        .multiply(rotationX)
        .multiply(rotationY)
        .multiply(rotationZ);

      camera.projectionMatrix = m.multiply(l);
      renderer.state.reset();
      renderer.render(scene, camera);
      map.triggerRepaint();
    });
  };

  useEffect(() => {
    const node = mapNode.current;
    if (typeof window === 'undefined' || node === null) return;

    if (node.firstChild) {
      node.removeChild(node.firstChild);
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const mapboxMap = new mapboxgl.Map({
          container: node,
          accessToken: MAPBOX_TOKEN,
          style: 'mapbox://styles/mapbox/standard', // Changing to a lighter style
          center: [longitude, latitude],
          zoom: 17,
        });

        setMap(mapboxMap);
        setUserLocation([longitude, latitude]);

        renderer = new THREE.WebGLRenderer({
          canvas: mapboxMap.getCanvas(),
          context: (mapboxMap as any).painter.context.gl,
          antialias: true,
        });

        renderer.autoClear = false;
        renderer.clearDepth();

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
        directionalLight.position.set(0, 70, 100).normalize();
        scene.add(directionalLight);

        mapboxMap.on('style.load', () => {
          mapboxMap.setConfigProperty('basemap', 'lightPreset', 'dusk');
          mapboxMap.setConfigProperty('basemap', 'showPointOfInterestLabels', false);
          mapboxMap.setConfigProperty('basemap', 'showTransitLabels', false);
        });

        mapboxMap.on('load', () => {
          if (userLocation) {
            addExplorationCircleToMap(mapboxMap, userLocation, EXPLORATION_RADIUS_METERS);
          }

          mapboxMap.on('click', (e) => {
            mouse.x = (e.point.x / mapboxMap.getCanvas().clientWidth) * 2 - 1;
            mouse.y = -(e.point.y / mapboxMap.getCanvas().clientHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);

            const intersects = raycaster.intersectObjects(scene.children, true);

            if (intersects.length > 0) {
              const intersectedObject = intersects[0].object;
              const totemData = intersectedObject.userData as Totem;
              setSelectedTotem(totemData);
            }
          });

          fetchTotems();
        });

        return () => {
          mapboxMap.remove();
        };
      },
      (error) => {
        console.error('Error al obtener la ubicación del usuario:', error);
      }
    );
  }, [createTotemMarkerElement]);

  useEffect(() => {
    if (map && userLocation) {
      if (markerRef.current) {
        markerRef.current.remove();
      }

      const userLocationMarker = new mapboxgl.Marker({
        element: createMarkerElement(),
        draggable: false,
      })
        .setLngLat(userLocation as [number, number])
        .addTo(map);

      markerRef.current = userLocationMarker;
    }
  }, [map, userLocation, createMarkerElement]);

  useEffect(() => {
    if (map && userLocation) {
      if (map.isStyleLoaded()) {
        addExplorationCircleToMap(map, userLocation, EXPLORATION_RADIUS_METERS);
      } else {
        map.on('style.load', () => {
          addExplorationCircleToMap(map, userLocation, EXPLORATION_RADIUS_METERS);
        });
      }
    }
  }, [map, userLocation]);

  useEffect(() => {
    if (map && userLocation) {
      pins.forEach((pin) => {
        const coordinates: [number, number] = [pin.location.coordinates[0], pin.location.coordinates[1]];
        const distance = calculateDistance(userLocation as [number, number], coordinates);
        if (distance <= EXPLORATION_RADIUS_METERS) {
          new mapboxgl.Marker({
            element: createPinMarkerElement(pin),
          })
            .setLngLat(coordinates)
            .addTo(map);
        }
      });
    }
  }, [map, pins, userLocation, createPinMarkerElement]);

  useEffect(() => {
    fetchPins();
  }, [fetchPins]);

  const toggleDebugMode = useCallback(() => {
    setIsDebugMode((prev) => !prev);
  }, []);

  return (
    <section className="max-h-[100dvh] overflow-hidden">
      {showTotemForm && user && user._id && (
        <TotemFormModal
          onClose={() => setShowTotemForm(false)}
          userLocation={userLocation as [number, number]} // Asegurando que userLocation no sea null
          userId={user._id}
          onTotemCreated={fetchTotems}
        />
      )}
      {selectedPin && (
        <PinDetailModal
          pin={selectedPin}
          onClose={() => setSelectedPin(null)}
        />
      )}
      {selectedTotem && (
        <TotemDetailModal
          totem={selectedTotem}
          onClose={() => setSelectedTotem(null)}
        />
      )}
      <div ref={mapNode} style={{ width: '100%', height: '100dvh' }} />
        <TotemFilterDrawer onApplyFilters={handleApplyFilters} /> {/* Add the new drawer */}
      <section className='fixed z-50 bottom-14 w-fit right-3 h-fit'>
        <PinFormDrawer
          userLocation={userLocation as [number, number]}
          userId={user ? user._id : ''}
          onPinCreated={fetchPins}
        />
        {/* Solo activar para subir totems */}
        <button
          className='absolute right-28 bottom-3 w-14 h-14 rounded-full overflow-hidden flex justify-center items-center bg-gradient-to-tr from-green-500 to-green-800 p-[2px]'
          onClick={handleAddTotem}
        >
          <div className='flex justify-center items-center w-full h-full p-2.5 bg-black/30 backdrop-blur-3xl rounded-full'>
            <img src="../assets/map-icons/totem.svg" alt="Add Totem" className='w-full filter hue-rotate-[210deg] h-full object-contain' />
          </div>
        </button>
        <button
          className='absolute right-[49px] bottom-[59px] bg-black/50 flex justify-center items-center w-9 h-9 rounded-full p-2'
        >
          <img src="../assets/map-icons/ranking.svg" alt="Ranking" className='w-full h-full object-contain opacity-80' />
        </button>
        <button
          className={`absolute right-[3.8rem] bottom-3 flex justify-center items-center w-9 h-9 rounded-full p-2 ${isDebugMode ? "bg-yellow-500" : "bg-black/50"}`}
          onClick={toggleDebugMode}
        >
          <img src="../assets/map-icons/rayo.svg" alt="Debug Mode" className="w-full h-full object-contain opacity-80" />
        </button>
        <button
          onClick={centerMapOnUserLocation}
          className="absolute right-0 bottom-[73px] bg-black/50 flex justify-center items-center w-9 h-9 rounded-full p-1.5"
        >
          <img
            src="../assets/map-icons/gps.svg"
            alt="GPS"
            className="w-full h-full rotate-45 opacity-80"
          />
        </button>
      </section>
      
    </section>
  );
};

export default Map;
