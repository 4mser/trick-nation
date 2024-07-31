// MissionFormModal.tsx

import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import { Mission } from '@/types/mission';

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
  missionToEdit?: Mission | null; // Nuevo campo opcional para edición
}

const MissionFormModal: React.FC<MissionFormModalProps> = ({ onClose, userId, onMissionCreated, missionToEdit }) => {
  const [name, setName] = useState(missionToEdit?.name || '');
  const [type, setType] = useState(missionToEdit?.type || '');
  const [difficulty, setDifficulty] = useState(missionToEdit?.difficulty || '');
  const [startDate, setStartDate] = useState(missionToEdit?.startDate ? new Date(missionToEdit.startDate).toISOString().split('T')[0] : '');
  const [endDate, setEndDate] = useState(missionToEdit?.endDate ? new Date(missionToEdit.endDate).toISOString().split('T')[0] : '');
  const [description, setDescription] = useState(missionToEdit?.description || '');
  const [rewards, setRewards] = useState<string[]>(missionToEdit?.rewards || []);
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('type', type);
    formData.append('difficulty', difficulty);
    if (startDate) formData.append('startDate', new Date(startDate).toISOString());
    if (endDate) formData.append('endDate', new Date(endDate).toISOString());
    formData.append('description', description);
    rewards.forEach((reward, index) => formData.append(`rewards[${index}]`, reward));
    if (image) formData.append('image', image);

    try {
      if (missionToEdit) {
        await api.patch(`/missions/${missionToEdit._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await api.post('/missions', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      onMissionCreated();
      onClose();
    } catch (error) {
      console.error('Failed to save mission:', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleRewardsChange = (index: number, value: string) => {
    const newRewards = [...rewards];
    newRewards[index] = value;
    setRewards(newRewards);
  };

  const addRewardField = () => {
    setRewards([...rewards, '']);
  };

  const removeRewardField = (index: number) => {
    const newRewards = rewards.filter((_, i) => i !== index);
    setRewards(newRewards);
  };

  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white/10 overflow-y-auto backdrop-blur-md text-white p-8 shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">{missionToEdit ? 'Edit Mission' : 'Add New Mission'}</h2>
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
            <label className="block text-gray-300 mb-2">Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 outline-none text-white bg-neutral-900 border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Rewards:</label>
            {rewards.map((reward, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="text"
                  value={reward}
                  onChange={(e) => handleRewardsChange(index, e.target.value)}
                  className="w-full p-2 outline-none text-white bg-neutral-900 border-gray-300 rounded"
                />
                <button type="button" onClick={() => removeRewardField(index)} className="ml-2 text-red-500">Remove</button>
              </div>
            ))}
            <button type="button" onClick={addRewardField} className="text-blue-500">Add Reward</button>
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Upload Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="flex justify-between">
            <button type="button" onClick={onClose} className="text-white px-4 py-2 rounded">Cancelar</button>
            <button type="submit" className="bg-gradient-to-br border-r border-b border-yellow-600/20 from-yellow-600/60 to-neutral-900/40 text-white px-4 py-2 rounded mr-2">{missionToEdit ? 'Guardar Cambios' : 'Agregar Misión'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MissionFormModal;
