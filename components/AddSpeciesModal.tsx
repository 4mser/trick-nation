import React, { useState } from 'react';
import api from '@/services/api';

interface AddSpeciesModalProps {
  missionId: string;
  onClose: () => void;
  onSpeciesAdded: () => void;
}

const AddSpeciesModal: React.FC<AddSpeciesModalProps> = ({ missionId, onClose, onSpeciesAdded }) => {
  const [name, setName] = useState('');
  const [scientificName, setScientificName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image) {
      console.error('No image selected');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('scientificName', scientificName);
    formData.append('description', description);
    formData.append('image', image);

    try {
      await api.patch(`/missions/${missionId}/species`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onSpeciesAdded();
      onClose();
    } catch (error) {
      console.error('Failed to add species:', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white/10 overflow-y-auto backdrop-blur-md text-white p-8 shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Add New Species</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Species Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-2 outline-none text-white bg-neutral-900 border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Scientific Name:</label>
            <input
              type="text"
              value={scientificName}
              onChange={(e) => setScientificName(e.target.value)}
              required
              className="w-full p-2 outline-none text-white bg-neutral-900 border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full p-2 outline-none text-white bg-neutral-900 border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Upload Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="flex justify-between">
            <button type="button" onClick={onClose} className="text-white px-4 py-2 rounded">Cancel</button>
            <button type="submit" className="bg-gradient-to-br border-r border-b border-yellow-600/20 from-yellow-600/60 to-neutral-900/40 text-white px-4 py-2 rounded mr-2">Add Species</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSpeciesModal;
