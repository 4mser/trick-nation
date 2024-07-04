'use client';

import React, { useState } from 'react';
import api from '@/services/api';

interface SpotFormModalProps {
  onClose: () => void;
  userLocation: [number, number] | null;
  userId: string;
  onSpotCreated: () => void;
}

const SpotFormModal: React.FC<SpotFormModalProps> = ({ onClose, userLocation, userId, onSpotCreated }) => {
  const [name, setName] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userLocation) return;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('discoveredByUserId', userId);
    formData.append('location[type]', 'Point');
    formData.append('location[coordinates][0]', userLocation[0].toString());
    formData.append('location[coordinates][1]', userLocation[1].toString());
    if (file) {
      formData.append('file', file);
    }

    try {
      await api.post('/spots', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onSpotCreated();
      onClose();
    } catch (error) {
      console.error('Failed to create spot:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="fixed z-[100] inset-0 flex items-center justify-center bg-black/30">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-white">Deja un Pin en el mapa</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Comentario:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded bg-transparent text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Cargar Archivo:</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full rounded bg-transparent text-white/70"
            />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="bg-yellow-500 text-white px-4 py-2 rounded mr-2">Subir</button>
            <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SpotFormModal;
