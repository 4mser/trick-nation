'use client';

import React from 'react';
import Map from '@/components/Map';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/auth-context';
import { User } from '@/types/user';
import Link from 'next/link';


const MapPage: React.FC = () => {
  const { user } = useAuth();
  return (
    <ProtectedRoute>
      {user && (
          <Link href="/profile" className='absolute top-4 left-4 z-10 rounded-full border-2 border-white/80 backdrop-blur-md p-1'>
            <img
              src={user.profilePictureUrl || '/profile.jpeg'}
              alt="Profile Picture"
              className="w-10 h-10 object-cover rounded-full"
            />
          </Link>
        )}
      <Map />
    </ProtectedRoute>
  );
};

export default MapPage;
