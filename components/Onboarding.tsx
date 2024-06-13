'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import { useAuth } from '@/context/auth-context';
import RolesExplanation from './RolesExplanation';
import TestPsicologico from './TestPsicologico';
import NucleusExplanation from './NucleusExplanation'; // Import the new component
import NucleusSelection from './NucleusSelection';
import OnboardingProfileForm from './OnboardingProfileForm';
import Loader from './Loader';

const Onboarding: React.FC = () => {
  const { user, refetch } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (user && user.onboardingCompleted) {
      router.push('/');
    } else if (user && user.roles && user.roles.length > 0) {
      setStep(2);
    }
  }, [user, router]);

  const handleRoleExplanationComplete = () => {
    setStep(1);
  };

  const handleRoleComplete = async (role: string) => {
    try {
      if (user) {
        await api.put(`/users/${user._id}/role`, { roles: [role] });
        setStep(2);
      }
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const handleNucleusExplanationComplete = () => {
    setStep(3);
  };

  const handleNucleusComplete = async (nucleus: string) => {
    try {
      if (user) {
        await api.put(`/users/${user._id}/nucleus`, { nucleus });
        setStep(4);
      }
    } catch (error) {
      console.error('Error updating user nucleus:', error);
    }
  };

  const handleProfileComplete = async () => {
    try {
      if (user) {
        await api.put(`/users/${user._id}`, { onboardingCompleted: true });
        await refetch();
        router.push('/');
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  if (!user) {
    return <div className='w-full h-[95dvh] grid place-items-center'>
        <Loader />
    </div>;
  }

  if (step === 0) {
    return (
      <main className='w-full h-[100dvh] overflow-y-auto z-20 fixed top-0 left-0 bg-neutral-950'>
        <RolesExplanation onComplete={handleRoleExplanationComplete} />
      </main>
    );
  } else if (step === 1) {
    return (
      <main className='w-full h-[100dvh] overflow-y-auto z-20 fixed top-0 left-0 bg-neutral-950'>
        <TestPsicologico onComplete={handleRoleComplete} />
      </main>
    ); 
  } else if (step === 2) {
    return (
      <main className='w-full h-[100dvh] z-20 fixed top-0 left-0 bg-neutral-950'>
        <NucleusExplanation onComplete={handleNucleusExplanationComplete} />
      </main>
    );
  } else if (step === 3) {
    return (
      <main className='w-full h-[100dvh] z-20 fixed top-0 left-0 bg-neutral-950'>
        <NucleusSelection onComplete={handleNucleusComplete} />
      </main>
    );
  }

  return (
    <main className='w-full h-[100dvh] z-20 fixed top-0 left-0 bg-neutral-950'>
      <OnboardingProfileForm onComplete={handleProfileComplete} />
    </main>
  );
};

export default Onboarding;
