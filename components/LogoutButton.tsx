'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';

const LogoutButton: React.FC = () => {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/Auth/login');
  };

  return <button onClick={handleLogout} className='bg-red-800 hover:bg-red-900 p-2 rounded-md text-xs'>Cerrar Sesión</button>;
};

export default LogoutButton;
