'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/services/api';
import { useAuth } from '@/context/auth-context';
import Image from 'next/image';

const RegisterForm: React.FC = () => {
  const { user } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await api.post('/auth/register', { username, email, password });
      console.log('Registration response:', response.data);
      setTimeout(() => {
        router.push('/Auth/login');
      }, 500);
    } catch (error: any) {
      console.error('Registration failed: ', error);
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('Registration failed');
      }
    }
  };

  if (user) {
    return null; // No renderizar el formulario si el usuario ya está autenticado
  }

  return (
    <div className="flex items-center justify-center flex-col h-[100dvh] bg-neutral-950">
      <Image 
        src="/images/isotipoXplorers.png"
        width={130}
        height={130}
        alt='isotipo xplorers'
      />
      <form onSubmit={handleSubmit} className="bg-neutral-950 p-8 rounded-lg shadow-lg w-full max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-white mb-3">Registro</h2>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-white mb-2">Nombre de Usuario:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-2 bg-neutral-800 text-white rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-600"
          />
        </div>
        <div className="mb-4">
          <label className="block text-white mb-2">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 bg-neutral-800 text-white rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-600"
          />
        </div>
        <div className="mb-4">
          <label className="block text-white mb-2">Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 bg-neutral-800 text-white rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-600"
          />
        </div>
        <button
          type="submit"
          className="w-full mt-2 border border-yellow-600 bg-gradient-to-br from-yellow-600/20 to-transparent hover:from-yellow-600/60 text-white transition py-2 px-4 rounded-md focus:outline-none "
        >
          Registrarme
        </button>
        <div className="text-center text-white mt-4">
          ¿Ya tienes una cuenta?{' '}
          <Link href="/Auth/login" className='text-yellow-600 hover:underline'>Inicia sesión</Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
