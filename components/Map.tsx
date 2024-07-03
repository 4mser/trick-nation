import React, { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl, { LngLatLike, Marker } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import api from '@/services/api';
import { useAuth } from '@/context/auth-context';
import SpotFormModal from './SpotFormModal';
import SpotDetailModal from './SpotDetailModal';
import TotemFormModal from './TotemFormModal';
import { Spot } from '../types/spots';
import { Totem } from "@/types/totem";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

const Map: React.FC = () => {
  const { user } = useAuth();
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const mapNode = useRef<HTMLDivElement | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const [spots, setSpots] = useState<Spot[]>([]);
  const [totems, setTotems] = useState<Totem[]>([]);
  const [showSpotForm, setShowSpotForm] = useState(false);
  const [showTotemForm, setShowTotemForm] = useState(false);
  const [isDebugMode, setIsDebugMode] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);

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

  const createSpotMarkerElement = useCallback((spot: Spot) => {
    const markerElement = document.createElement('div');
    markerElement.className = 'spot-marker';
    markerElement.style.width = '40px';
    markerElement.style.height = '40px';
    markerElement.style.borderRadius = '50%';
    markerElement.style.overflow = 'hidden';
    markerElement.style.border = '2px solid white';
    markerElement.style.boxShadow = '0 0 5px rgba(0,0,0,0.5)';
    
    const img = document.createElement('img');
    img.src = `${spot.imageUrl || '/default-spot-image.jpg'}`;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    
    markerElement.appendChild(img);
    
    markerElement.addEventListener('click', () => {
      setSelectedSpot(spot);
    });
    
    return markerElement;
  }, []);

  const centerMapOnUserLocation = useCallback(() => {
    if (map && userLocation) {
      map.flyTo({ center: userLocation as [number, number], zoom: 17 });
    }
  }, [map, userLocation]);

  const handleMarkSpot = useCallback(() => {
    if (!userLocation || !user) return;
    setShowSpotForm(true);
  }, [userLocation, user]);

  const handleAddTotem = useCallback(() => {
    if (!userLocation || !user) return;
    setShowTotemForm(true);
  }, [userLocation, user]);

  const fetchSpots = useCallback(async () => {
    try {
      const response = await api.get<Spot[]>('/spots');
      setSpots(response.data);
    } catch (error) {
      console.error('Failed to fetch spots:', error);
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

  useEffect(() => {
    const node = mapNode.current;
    if (typeof window === 'undefined' || node === null) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const mapboxMap = new mapboxgl.Map({
          container: node,
          accessToken: MAPBOX_TOKEN,
          style: 'mapbox://styles/mapbox/dark-v11',
          center: [longitude, latitude],
          zoom: 17,
        });

        setMap(mapboxMap);
        setUserLocation([longitude, latitude]);

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
  }, [isDebugMode]);

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
      spots.forEach((spot) => {
        const coordinates: [number, number] = [spot.location.coordinates[0], spot.location.coordinates[1]];
        new mapboxgl.Marker({
          element: createSpotMarkerElement(spot),
        })
          .setLngLat(coordinates)
          .addTo(map);
      });
    }
  }, [map, spots, createSpotMarkerElement]);

  useEffect(() => {
    fetchSpots();
    fetchTotems();
  }, [fetchSpots, fetchTotems]);

  useEffect(() => {
    if (map) {
      totems.forEach((totem) => {
        add3DModelToMap(map, totem.modelUrl, totem.location.coordinates);
      });
    }
  }, [map, totems]);

  const toggleDebugMode = useCallback(() => {
    setIsDebugMode((prev) => !prev);
  }, []);

  const add3DModelToMap = (map: mapboxgl.Map, modelUrl: string, location: [number, number]) => {
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

    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    const renderer = new THREE.WebGLRenderer({
      canvas: map.getCanvas(),
      context: (map as any).painter.context.gl,
      antialias: true,
    });

    renderer.autoClear = false;
    renderer.clearDepth();

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(0, 70, 100).normalize();
    scene.add(directionalLight);

    const clock = new THREE.Clock();
    let mixer: THREE.AnimationMixer | null = null;

    const loader = new GLTFLoader();

    loader.load(modelUrl, (gltf) => {
      const model = gltf.scene;
      mixer = new THREE.AnimationMixer(model);
      gltf.animations.forEach((clip) => {
        mixer?.clipAction(clip).play();
      });

      scene.add(model);
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

  return (
    <section className="max-h-[100dvh] overflow-hidden">
      <div ref={mapNode} style={{ width: '100%', height: '100dvh' }} />
      <section className='fixed z-50 bottom-14 w-fit right-3 h-fit'>
        <button
          className='absolute right-0 bottom-3 w-14 h-14 rounded-full overflow-hidden flex justify-center items-center bg-gradient-to-tr from-yellow-500 to-yellow-800 p-[2px]'
          onClick={handleMarkSpot}
        >
          <div className='flex justify-center items-center w-full h-full p-2.5 bg-black/30 backdrop-blur-3xl rounded-full'>
            <img src="../assets/map-icons/pin.svg" alt="Mark Spot" className='w-full filter hue-rotate-[210deg] h-full object-contain' />
          </div>
        </button>
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
      {showSpotForm && user && user._id && (
        <SpotFormModal
          onClose={() => setShowSpotForm(false)}
          userLocation={userLocation as [number, number]} // Asegurando que userLocation no sea null
          userId={user._id}
          onSpotCreated={fetchSpots}
        />
      )}
      {showTotemForm && user && user._id && (
        <TotemFormModal
          onClose={() => setShowTotemForm(false)}
          userLocation={userLocation as [number, number]} // Asegurando que userLocation no sea null
          userId={user._id}
          onTotemCreated={fetchTotems}
        />
      )}
      {selectedSpot && (
        <SpotDetailModal
          spot={selectedSpot}
          onClose={() => setSelectedSpot(null)}
        />
      )}
    </section>
  );
};

export default Map;
