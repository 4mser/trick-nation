import React, { useState } from 'react';
import api from '@/services/api';

const missionTypes = [
  { name: 'Biodiversidad' },
  { name: 'Puzzles' },
  { name: 'Limpieza' },
];

const difficulties = [
  { name: 'Fácil' },
  { name: 'Medio' },
  { name: 'Difícil' },
];

interface MissionFormModalProps {
  onClose: () => void;
  userId: string;
  onMissionCreated: () => void;
}

const MissionFormModal: React.FC<MissionFormModalProps> = ({ onClose, userId, onMissionCreated }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image) {
      console.error('No image selected');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('type', type);
    formData.append('difficulty', difficulty);
    if (startDate) formData.append('startDate', new Date(startDate).toISOString());
    if (endDate) formData.append('endDate', new Date(endDate).toISOString());
    formData.append('image', image);

    try {
      console.log('Sending form data...');
      await api.post('/missions', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onMissionCreated();
      onClose();
    } catch (error) {
      console.error('Failed to create mission:', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white/10 overflow-y-auto backdrop-blur-md text-white p-8  shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Add New Mission</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Mission Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-2 outline-none text-white bg-neutral-900 border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Mission Type:</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
              className="w-full p-2 outline-none text-white bg-neutral-900 border-gray-300 rounded"
            >
              <option value="" disabled>Select Type</option>
              {missionTypes.map((missionType) => (
                <option key={missionType.name} value={missionType.name}>
                  {missionType.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Difficulty:</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              required
              className="w-full p-2 outline-none text-white bg-neutral-900 border-gray-300 rounded"
            >
              <option value="" disabled>Select Difficulty</option>
              {difficulties.map((level) => (
                <option key={level.name} value={level.name}>
                  {level.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Start Date:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 outline-none text-white bg-neutral-900 border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">End Date:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
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
            <button type="button" onClick={onClose} className="text-white px-4 py-2 rounded">Cancelar</button>
            <button type="submit" className="bg-gradient-to-br border-r border-b border-yellow-600/20 from-yellow-600/60 to-neutral-900/40 text-white px-4 py-2 rounded mr-2">Agregar Misión</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MissionFormModal;
