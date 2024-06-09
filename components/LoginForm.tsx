'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/services/api';
import { useAuth } from '@/context/auth-context';

const LoginForm: React.FC = () => {
  const { user, login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous error message
    try {
      const response = await api.post('/auth/login', { identifier, password });
      login(response.data.access_token);
      const { user } = response.data;
      if (!user.onboardingCompleted) {
        router.push(`/onboarding?userId=${user._id}`);
      } else {
        router.push('/');
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        setError(error.response.data.message);
      } else {
        setError('Login failed. Please try again.');
      }
    }
  };

  if (user) {
    return null; // No renderizar el formulario si el usuario ya está autenticado
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-950">
      <form onSubmit={handleSubmit} className="bg-neutral-950 p-8 rounded-lg shadow-lg w-full max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Inicio de Sesión</h2>
        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
        <div className="mb-4">
          <label className="block text-white mb-2">Email o Username:</label>
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            className="w-full p-2 bg-neutral-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
        <div className="mb-6">
          <label className="block text-white mb-2">Contraseña:</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder='******'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 bg-neutral-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-200"
            >
              {showPassword ? 'Ocultar' : 'Ver'}
            </button>
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Iniciar Sesión
        </button>
        <div className="text-center text-white mt-4">
          ¿No tienes una cuenta?{' '}
          <Link href="/Auth/register" className='text-green-500 hover:underline'>
            Regístrate
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
