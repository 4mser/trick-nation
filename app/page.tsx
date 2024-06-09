'use client'
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import OnboardingModal from '@/components/OnboardingModal';
import api from '@/services/api';
import { User } from '@/types/user';

const Home: React.FC = () => {
  const { user } = useAuth();
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (user) {
        try {
          const response = await api.get(`/users/${user._id}`);
          const userData: User = response.data;
          setShowOnboardingModal(!userData.onboardingCompleted);
        } catch (error) {
          console.error('Error checking onboarding status:', error);
        }
      }
      setLoading(false);
    };

    checkOnboardingStatus();
  }, [user]);

  const handleComplete = () => {
    setShowOnboardingModal(false);
    window.location.href = '/onboarding';
  };

  const handleSkip = () => {
    setShowOnboardingModal(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Hola Xplorers</h1>
      {showOnboardingModal && user && (
        <OnboardingModal
          user={user}
          onComplete={handleComplete}
          onSkip={handleSkip}
        />
      )}
      {/* El resto de tu código */}
    </div>
  );
};

export default Home;
