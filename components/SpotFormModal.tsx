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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Mark a Spot</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Spot Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Upload Image:</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Save</button>
            <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SpotFormModal;
