import React, { useState } from 'react';
import api from '@/services/api';

const MissionForm: React.FC<{ onMissionCreated: () => void }> = ({ onMissionCreated }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [species, setSpecies] = useState([{ name: '', scientificName: '', description: '', imageUrl: '' }]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('type', type);
    formData.append('difficulty', difficulty);
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);
    if (image) formData.append('image', image);

    species.forEach((specie, index) => {
      formData.append(`species[${index}][name]`, specie.name);
      formData.append(`species[${index}][scientificName]`, specie.scientificName);
      formData.append(`species[${index}][description]`, specie.description);
      formData.append(`species[${index}][imageUrl]`, specie.imageUrl);
    });

    try {
      await api.post('/missions', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onMissionCreated();
    } catch (error) {
      console.error('Failed to create mission:', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSpeciesChange = (index: number, field: string, value: string) => {
    const newSpecies = [...species];
    newSpecies[index] = { ...newSpecies[index], [field]: value };
    setSpecies(newSpecies);
  };

  const addSpecies = () => {
    setSpecies([...species, { name: '', scientificName: '', description: '', imageUrl: '' }]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label>Type:</label>
        <input type="text" value={type} onChange={(e) => setType(e.target.value)} required />
      </div>
      <div>
        <label>Difficulty:</label>
        <input type="text" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} required />
      </div>
      <div>
        <label>Start Date:</label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      </div>
      <div>
        <label>End Date:</label>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </div>
      <div>
        <label>Image:</label>
        <input type="file" accept="image/*" onChange={handleImageChange} required />
      </div>
      <div>
        <label>Species:</label>
        {species.map((specie, index) => (
          <div key={index}>
            <input type="text" placeholder="Name" value={specie.name} onChange={(e) => handleSpeciesChange(index, 'name', e.target.value)} required />
            <input type="text" placeholder="Scientific Name" value={specie.scientificName} onChange={(e) => handleSpeciesChange(index, 'scientificName', e.target.value)} required />
            <input type="text" placeholder="Description" value={specie.description} onChange={(e) => handleSpeciesChange(index, 'description', e.target.value)} required />
            <input type="text" placeholder="Image URL" value={specie.imageUrl} onChange={(e) => handleSpeciesChange(index, 'imageUrl', e.target.value)} required />
          </div>
        ))}
        <button type="button" onClick={addSpecies}>Add Species</button>
      </div>
      <button type="submit">Create Mission</button>
    </form>
  );
};

export default MissionForm;
