'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import { useAuth } from '@/context/auth-context';
import TestPsicologico from './TestPsicologico';
import NucleusSelection from './NucleusSelection';
import Loader from './Loader';

const Onboarding: React.FC = () => {
  const { user, refetch } = useAuth();
  const router = useRouter();
  const [roleAssigned, setRoleAssigned] = useState(false);

  useEffect(() => {
    if (user && user.onboardingCompleted) {
      router.push('/');
    } else if (user && user.roles && user.roles.length > 0) {
      setRoleAssigned(true);
    }
  }, [user, router]);

  const handleRoleComplete = async (role: string) => {
    try {
      if (user) {
        await api.put(`/users/${user._id}/role`, { roles: [role] });
        setRoleAssigned(true);
      }
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const handleNucleusSubmit = async (nucleus: string) => {
    try {
      if (user) {
        await api.put(`/users/${user._id}/nucleus`, { nucleus });
        await api.put(`/users/${user._id}`, { onboardingCompleted: true });
        await refetch();
        router.push('/');
      }
    } catch (error) {
      console.error('Error updating user nucleus:', error);
    }
  };

  if (!user) {
    return <div className='w-full h-[95dvh] grid place-items-center'>
        <Loader />
    </div>;
  }

  if (!roleAssigned) {
    return (
        <main className='w-full h-[100dvh] overflow-y-auto z-20 fixed top-0 left-0 bg-neutral-950'>
            <TestPsicologico onComplete={handleRoleComplete} />
        </main>
    ) 
  }

  return (
    <main className='w-full h-[100dvh] z-20 fixed top-0 left-0 bg-neutral-950'>
        <NucleusSelection onComplete={handleNucleusSubmit} />
    </main>
) ;
};

export default Onboarding;
