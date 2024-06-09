'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import Loader from './Loader';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/Auth/welcome');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className='w-full h-[100dvh] grid place-items-center'><Loader /></div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
