'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import useCurrentUser from '@/hooks/useCurrentUser';
import api from '@/services/api';

interface EditProfileFormProps {
  onClose: () => void;
  onProfileUpdate: () => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ onClose, onProfileUpdate }) => {
  const { user, loading } = useCurrentUser();
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    city: user?.city || '',
    description: user?.description || '',
    country: user?.country || '',
    profilePicture: null as File | null,
  });
  const [error, setError] = useState('');
  const router = useRouter();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>No user data</div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
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
      onProfileUpdate();
      onClose();
    } catch (error:any) {
      if (error.response && error.response.data.message === 'Username already exists') {
        setError('Este nombre de usuario ya está en uso. Por favor, elige otro.');
      } else {
        setError('Ocurrió un error al actualizar el perfil.');
      }
      console.error('Failed to update profile:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-neutral-950 p-8 rounded-lg shadow-lg w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Editar Perfil</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <div className="mb-4">
        <label className="block text-white mb-2">Nombre de Usuario:</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          className="w-full p-2 bg-neutral-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>
      <div className="mb-4">
        <label className="block text-white mb-2">Descripción:</label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          className="w-full p-2 bg-neutral-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>
      <div className="mb-4">
        <label className="block text-white mb-2">Correo Electrónico:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-2 bg-neutral-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>
      <div className="mb-4">
        <label className="block text-white mb-2">Ciudad:</label>
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          className="w-full p-2 bg-neutral-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>
      <div className="mb-4">
        <label className="block text-white mb-2">País:</label>
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={handleChange}
          className="w-full p-2 bg-neutral-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>
      <div className="mb-4">
        <label className="block text-white mb-2">Foto de Perfil:</label>
        <input
          type="file"
          name="profilePicture"
          onChange={handleFileChange}
          className="w-full p-2 bg-neutral-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>
      <button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        Actualizar Perfil
      </button>
      <button
        type="button"
        onClick={onClose}
        className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Cancelar
      </button>
    </form>
  );
};

export default EditProfileForm;