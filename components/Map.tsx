import React, { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl, { LngLatLike, Marker } from "mapbox-gl";
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

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
const EXPLORATION_RADIUS_METERS = 30;

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

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera();
  const clock = new THREE.Clock();
  let mixer: THREE.AnimationMixer | null = null;
  let renderer: THREE.WebGLRenderer;

  const createMarkerElement = useCallback(
    (isExplorationRadio = false) => {
      const markerElement = document.createElement('div');
      markerElement.className = 'custom-marker';
      const markerSize = isExplorationRadio ? 270 : 18;
      markerElement.style.width = `${markerSize}px`;
      markerElement.style.height = `${markerSize}px`;
      markerElement.style.borderRadius = '50%';
      markerElement.style.backgroundColor = isExplorationRadio ? 'rgba(234, 179, 8, 0.233)' : 'rgb(234, 179, 8)';
      return markerElement;
    },
    []
  );

  const createPinMarkerElement = useCallback((pin: Pin) => {
    const markerElement = document.createElement('div');
    markerElement.className = 'pin-marker';
    markerElement.style.width = '40px';
    markerElement.style.height = '40px';
    markerElement.style.borderRadius = '50%';
    markerElement.style.overflow = 'hidden';
    markerElement.style.boxShadow = '0 2px 5px rgba(0,0,0,0.5)';
    
    const img = document.createElement('img');
    img.src = `${pin.imageUrl || '/default-pin-image.jpg'}`;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.borderRadius = '50%'
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
    markerElement.style.width = '60px';
    markerElement.style.height = '60px';
    markerElement.style.borderRadius = '50%';
    markerElement.style.overflow = 'hidden';
    markerElement.style.border = '3px solid rgb(234, 179, 8)';
    markerElement.style.boxShadow = '0 0 5px rgba(0,0,0,0.5)';
    
    const img = document.createElement('img');
    img.src = `${totem.imageUrl}`;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.borderRadius = '50%'
    img.style.padding = '3px'
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
    } catch (error) {
      console.error('Failed to fetch totems:', error);
    }
  }, []);

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

    // Asegúrate de que el contenedor del mapa esté vacío
    if (node.firstChild) {
      node.removeChild(node.firstChild);
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const mapboxMap = new mapboxgl.Map({
          container: node,
          accessToken: MAPBOX_TOKEN,
          style: 'mapbox://styles/mapbox/standard',
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
          mapboxMap.on('zoom', () => {
            if (markerRef.current) {
              const zoomLevel = mapboxMap.getZoom();
              const metersPerPixel = (156543.03392 * Math.cos(latitude * (Math.PI / 180))) / Math.pow(2, zoomLevel);
              const explorationRadioRadiusInMeters = 270;
              const explorationRadioRadiusInPixels = explorationRadioRadiusInMeters / metersPerPixel;
              const markerSizeInPixels = explorationRadioRadiusInPixels * 0.9;
              markerRef.current.getElement().style.width = `${markerSizeInPixels}px`;
              markerRef.current.getElement().style.height = `${markerSizeInPixels}px`;
            }
          });

          mapboxMap.on('click', (e) => {
            if (isDebugMode) {
              setUserLocation([e.lngLat.lng, e.lngLat.lat]);
              return;
            }

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

          totems.forEach((totem) => {
            if (totem.modelUrl) {
              add3DModelToMap(mapboxMap, totem.modelUrl, totem.location.coordinates, totem);
            } else {
              new mapboxgl.Marker({
                element: createTotemMarkerElement(totem),
              })
                .setLngLat(totem.location.coordinates as [number, number])
                .addTo(mapboxMap);
            }
          });
        });

        return () => {
          mapboxMap.remove();
        };
      },
      (error) => {
        console.error('Error al obtener la ubicación del usuario:', error);
      }
    );
  }, [isDebugMode, totems, createTotemMarkerElement]);

  useEffect(() => {
    if (map && userLocation) {
      if (markerRef.current) {
        markerRef.current.remove();
      }

      const userLocationMarker = new mapboxgl.Marker({
        element: createMarkerElement(),
        draggable: isDebugMode,
      })
        .setLngLat(userLocation as [number, number])
        .addTo(map)
        .on('dragend', () => {
          const newLocation = userLocationMarker.getLngLat();
          setUserLocation([newLocation.lng, newLocation.lat]);
        });

      const explorationRadioMarker = new mapboxgl.Marker({
        element: createMarkerElement(true),
      })
        .setLngLat(userLocation as [number, number])
        .addTo(map);

      markerRef.current = explorationRadioMarker;
    }
  }, [map, userLocation, createMarkerElement, isDebugMode]);

  useEffect(() => {
    if (map) {
      pins
        .filter(pin => calculateDistance(userLocation as [number, number], pin.location.coordinates) <= EXPLORATION_RADIUS_METERS)
        .forEach((pin) => {
          const coordinates: [number, number] = [pin.location.coordinates[0], pin.location.coordinates[1]];
          new mapboxgl.Marker({
            element: createPinMarkerElement(pin),
          })
            .setLngLat(coordinates)
            .addTo(map);
        });
    }
  }, [map, pins, userLocation, createPinMarkerElement]);

  useEffect(() => {
    fetchPins();
    fetchTotems();
  }, [fetchPins, fetchTotems]);

  const toggleDebugMode = useCallback(() => {
    setIsDebugMode((prev) => !prev);
  }, []);

  return (
    <section className="max-h-[100dvh] overflow-hidden">
      <div ref={mapNode} style={{ width: '100%', height: '100dvh' }} />
      <section className='fixed z-50 bottom-14 w-fit right-3 h-fit'>
        {/* El botón para abrir el drawer está dentro de PinFormDrawer */}
        <PinFormDrawer
          userLocation={userLocation as [number, number]}
          userId={user ? user._id : ''}
          onPinCreated={fetchPins}
        />
        {/* Solo activar para subir totems */}
        {/* <button
          className='absolute right-28 bottom-3 w-14 h-14 rounded-full overflow-hidden flex justify-center items-center bg-gradient-to-tr from-green-500 to-green-800 p-[2px]'
          onClick={handleAddTotem}
        >
          <div className='flex justify-center items-center w-full h-full p-2.5 bg-black/30 backdrop-blur-3xl rounded-full'>
            <img src="../assets/map-icons/totem.svg" alt="Add Totem" className='w-full filter hue-rotate-[210deg] h-full object-contain' />
          </div>
        </button> */}
        <button
          className='absolute right-[49px] bottom-[59px] bg-black/50 flex justify-center items-center w-9 h-9 rounded-full p-2'
        >
          <img src="../assets/map-icons/ranking.svg" alt="Ranking" className='w-full h-full object-contain opacity-80' />
        </button>
        <button
          className='absolute right-[3.8rem] bottom-3 bg-black/50 flex justify-center items-center w-9 h-9 rounded-full p-2'
          onClick={toggleDebugMode}
        >
          <img src="../assets/map-icons/rayo.svg" alt="Debug Mode" className='w-full h-full object-contain opacity-80' />
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
    </section>
  );
};

export default Map;
