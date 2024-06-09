// Onboarding.tsx
'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import { useAuth } from '@/context/auth-context';
import TestPsicologico from './TestPsicologico';

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
    return <div>Loading...</div>;
  }

  if (!roleAssigned) {
    return <TestPsicologico onComplete={handleRoleComplete} />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <h2 className="text-2xl font-bold text-white mb-6">Select Your Nucleus</h2>
      <button
        onClick={() => handleNucleusSubmit('Enigma')}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        Enigma
      </button>
      <button
        onClick={() => handleNucleusSubmit('Quantum')}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        Quantum
      </button>
      <button
        onClick={() => handleNucleusSubmit('Arbóreo')}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        Arbóreo
      </button>
      <button
        onClick={() => handleNucleusSubmit('Áureo')}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        Áureo
      </button>
    </div>
  );
};

export default Onboarding;
