'use client';

import React, { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl, { LngLatLike, Marker } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import api from '@/services/api';
import { useAuth } from '@/context/auth-context';
import SpotFormModal from './SpotFormModal';
import SpotDetailModal from './SpotDetailModal';
import { Spot } from '../types/spots';

const Map: React.FC = () => {
  const { user } = useAuth();
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const mapNode = useRef<HTMLDivElement | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const [spots, setSpots] = useState<Spot[]>([]);
  const [showSpotForm, setShowSpotForm] = useState(false);
  const [isDebugMode, setIsDebugMode] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null); // Estado para el spot seleccionado

  const createMarkerElement = useCallback(
    (isExplorationRadio = false) => {
      const markerElement = document.createElement('div');
      markerElement.className = 'custom-marker';
      const markerSize = isExplorationRadio ? 270 : 18;
      markerElement.style.width = `${markerSize}px`;
      markerElement.style.height = `${markerSize}px`;
      markerElement.style.borderRadius = '50%';
      markerElement.style.backgroundColor = isExplorationRadio
        ? 'rgba(211, 202, 76, 0.233)'
        : '#DD981D';
      return markerElement;
    },
    []
  );

  const createSpotMarkerElement = (spot: Spot) => {
    const markerElement = document.createElement('div');
    markerElement.className = 'spot-marker';
    markerElement.style.width = '40px';
    markerElement.style.height = '40px';
    markerElement.style.borderRadius = '50%';
    markerElement.style.overflow = 'hidden';
    markerElement.style.border = '2px solid white';
    markerElement.style.boxShadow = '0 0 5px rgba(0,0,0,0.5)';
    
    const img = document.createElement('img');
    img.src = `https://trick-nation-backend-production.up.railway.app${spot.imageUrl || '/default-spot-image.jpg'}`; // Ajusta esta línea
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    
    markerElement.appendChild(img);
    
    markerElement.addEventListener('click', () => {
      setSelectedSpot(spot); // Abrir modal con los detalles del spot
    });
    
    return markerElement;
  };

  const centerMapOnUserLocation = () => {
    if (map && userLocation) {
      map.flyTo({ center: userLocation, zoom: 17 });
    }
  };

  const handleMarkSpot = () => {
    if (!userLocation || !user) return;
    setShowSpotForm(true);
  };

  const fetchSpots = async () => {
    try {
      const response = await api.get<Spot[]>('/spots');
      setSpots(response.data);
    } catch (error) {
      console.error('Failed to fetch spots:', error);
    }
  };

  useEffect(() => {
    const node = mapNode.current;
    if (typeof window === 'undefined' || node === null) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const mapboxMap = new mapboxgl.Map({
          container: node,
          accessToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '',
          style: 'mapbox://styles/mapbox/standard',
          center: [longitude, latitude],
          zoom: 17,
        });

        mapboxMap.on('style.load', () => {
          mapboxMap.setConfigProperty('basemap', 'lightPreset', 'dusk');
          mapboxMap.setConfigProperty('basemap', 'showPointOfInterestLabels', false);
          mapboxMap.setConfigProperty('basemap', 'showTransitLabels', false);
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
        .setLngLat(userLocation)
        .addTo(map)
        .on('dragend', () => {
          const newLocation = userLocationMarker.getLngLat();
          setUserLocation([newLocation.lng, newLocation.lat]);
        });

      const explorationRadioMarker = new mapboxgl.Marker({
        element: createMarkerElement(true),
      })
        .setLngLat(userLocation)
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
  }, [map, spots]);

  useEffect(() => {
    fetchSpots();
  }, []);

  const toggleDebugMode = () => {
    setIsDebugMode(!isDebugMode);
  };

  return (
    <section className="max-h-[100dvh] overflow-hidden">
      <div ref={mapNode} style={{ width: '100%', height: '100dvh' }} />
      <section className='fixed z-50 bottom-14 w-fit right-3 h-fit'>
        <button
          className='absolute right-0 bottom-3 w-14 h-14 rounded-full overflow-hidden flex justify-center items-center bg-gradient-to-tr from-amber-500 to-amber-800 p-[2px]'
          onClick={handleMarkSpot}
        >
          <div className='flex justify-center items-center w-full h-full p-2.5 bg-black/30 backdrop-blur-3xl rounded-full'>
            <img src="../assets/map-icons/pin.svg" alt="Mark Spot" className='w-full filter hue-rotate-[210deg] h-full object-contain' />
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
          userLocation={userLocation}
          userId={user._id}
          onSpotCreated={fetchSpots}
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
