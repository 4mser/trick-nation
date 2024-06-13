'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import useCurrentUser from '@/hooks/useCurrentUser';
import api from '@/services/api';
import Loader from './Loader';
import Select, { StylesConfig } from 'react-select';
import { Icon } from '@iconify/react';

const citiesInChile = [
  { value: 'Santiago', label: 'Santiago' },
  { value: 'Valparaíso', label: 'Valparaíso' },
  { value: 'Concepción', label: 'Concepción' },
  { value: 'La Serena', label: 'La Serena' },
  { value: 'Antofagasta', label: 'Antofagasta' },
  { value: 'Temuco', label: 'Temuco' },
  { value: 'Rancagua', label: 'Rancagua' },
  { value: 'Iquique', label: 'Iquique' },
  { value: 'Puerto Montt', label: 'Puerto Montt' },
  { value: 'Chillán', label: 'Chillán' },
  { value: 'Arica', label: 'Arica' },
  { value: 'Talca', label: 'Talca' },
  { value: 'Coyhaique', label: 'Coyhaique' },
  { value: 'Punta Arenas', label: 'Punta Arenas' },
  { value: 'Valdivia', label: 'Valdivia' },
  { value: 'Osorno', label: 'Osorno' },
  { value: 'Calama', label: 'Calama' },
  { value: 'Copiapó', label: 'Copiapó' },
  { value: 'Curicó', label: 'Curicó' }
];

const customSelectStyles: StylesConfig<any, false> = {
  control: (base) => ({
    ...base,
    backgroundColor: '#2d2d2d',
    borderColor: '#444',
    color: '#fff',
    minHeight: '44px',
    '&:hover': {
      borderColor: 'var(--primary_color)',
    },
    boxShadow: 'none',
  }),
  singleValue: (base) => ({
    ...base,
    color: '#fff',
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: '#2d2d2d',
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? 'var(--primary_color)' : '#2d2d2d',
    color: state.isFocused ? '#000' : '#fff',
    '&:hover': {
      backgroundColor: 'var(--primary_color)',
      color: '#ffffff',
    },
  }),
};

const OnboardingProfileForm: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { user, loading } = useCurrentUser();
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    city: user?.city || '',
    description: user?.description || '',
    country: 'Chile',
    profilePicture: null as File | null,
  });
  const [error, setError] = useState('');

  if (loading) {
    return <div className='w-full h-[100dvh] grid place-items-center'><Loader /></div>;
  }

  if (!user) {
    return <div>No user data</div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCityChange = (selectedOption: any) => {
    setFormData((prevData) => ({ ...prevData, city: selectedOption.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setFormData((prevData) => ({ ...prevData, profilePicture: files[0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const form = new FormData();
    form.append('username', formData.username);
    form.append('email', formData.email);
    form.append('city', formData.city);
    form.append('country', formData.country);
    form.append('description', formData.description);
    if (formData.profilePicture) {
      form.append('file', formData.profilePicture);
    }

    try {
      const token = localStorage.getItem('token');
      await api.put(`/users/${user._id}`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      onComplete();
    } catch (error: any) {
      if (error.response && error.response.data.message === 'Username already exists') {
        setError('Este nombre de usuario ya está en uso. Por favor, elige otro.');
      } else {
        setError('Ocurrió un error al actualizar el perfil.');
      }
      console.error('Failed to update profile:', error);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="bg-neutral-950 p-8 rounded-lg shadow-lg w-full max-w-md mx-auto h-[100dvh] overflow-y-auto"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <h2 className="text-2xl font-bold text-white "><span className='text-yellow-500'>Por último:</span> Completa tu perfil</h2>
      <p className='mt-2 mb-6 opacity-70'>Podrás editarlo luego.</p>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <div className="mb-4">
        <label className="block text-white mb-2">Ciudad:</label>
        <Select
          options={citiesInChile}
          styles={customSelectStyles}
          value={citiesInChile.find(option => option.value === formData.city)}
          onChange={handleCityChange}
          placeholder="Selecciona una ciudad"
        />
      </div>
      <div className="mb-4">
        <label className="block text-white mb-2">País:</label>
        <Select
          options={[{ value: 'Chile', label: 'Chile' }]}
          styles={customSelectStyles}
          value={{ value: 'Chile', label: 'Chile' }}
          isDisabled
        />
      </div>
      <div className="mb-4">
        <label className="block text-white mb-2">Foto de Perfil:</label>
        <div className="flex items-center">
          <input
            type="file"
            name="profilePicture"
            id="profilePicture"
            onChange={handleFileChange}
            className="hidden"
          />
          <label htmlFor="profilePicture" className="cursor-pointer w-full flex items-center bg-neutral-800 p-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400">
            <Icon icon="mdi:camera" className="mr-2 text-2xl" />
            {formData.profilePicture ? formData.profilePicture.name : 'Subir Imagen'}
          </label>
        </div>
        {formData.profilePicture && (
          <div className="mt-4 flex justify-center">
            <img src={URL.createObjectURL(formData.profilePicture)} alt="Profile Preview" className="w-full object-cover shadow-md" />
          </div>
        )}
      </div>
      <motion.button
        type="submit"
        className="w-full rounded-md  bg-gradient-to-br from-yellow-500/20 to-transparent border border-yellow-500 hover:scale-95 transition-transform text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Completar
      </motion.button>
    </motion.form>
  );
};

export default OnboardingProfileForm;
