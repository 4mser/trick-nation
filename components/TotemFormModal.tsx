import React, { useState, useRef, useEffect } from 'react';
import api from '@/services/api';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

interface TotemFormModalProps {
  onClose: () => void;
  userLocation: [number, number];
  userId: string;
  onTotemCreated: () => void;
}

const TotemFormModal: React.FC<TotemFormModalProps> = ({ onClose, userLocation, userId, onTotemCreated }) => {
  const [name, setName] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<[number, number]>(userLocation);
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (mapContainer.current && !map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        accessToken: MAPBOX_TOKEN,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: userLocation,
        zoom: 17,
      });

      markerRef.current = new mapboxgl.Marker()
        .setLngLat(userLocation)
        .addTo(map.current);

      map.current.on('click', (e) => {
        const newLocation: [number, number] = [e.lngLat.lng, e.lngLat.lat];
        setSelectedLocation(newLocation);

        if (markerRef.current) {
          markerRef.current.setLngLat(newLocation);
        }
      });
    }
  }, [userLocation]);

  useEffect(() => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('webkitdirectory', 'true');
      fileInputRef.current.setAttribute('directory', 'true');
    }
  }, [fileInputRef]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!files) return;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('discoveredByUserId', userId);
    formData.append('location[type]', 'Point');
    formData.append('location[coordinates][0]', selectedLocation[0].toString());
    formData.append('location[coordinates][1]', selectedLocation[1].toString());

    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i], (files[i] as any).webkitRelativePath);
    }

    try {
      await api.post('/totems', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onTotemCreated();
      onClose();
    } catch (error) {
      console.error('Failed to create totem:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(e.target.files);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Add New Totem</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Totem Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Upload Model & Textures:</label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              ref={fileInputRef}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Selected Location:</label>
            <div className="mb-2">{selectedLocation.join(', ')}</div>
            <div ref={mapContainer} style={{ width: '100%', height: '300px', border: '1px solid #ddd' }}></div>
          </div>
          <div className="flex justify-end">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Add Totem</button>
            <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TotemFormModal;
