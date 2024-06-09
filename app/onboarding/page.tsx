import React from 'react';
import Onboarding from '@/components/Onboarding';
import ProtectedRoute from '@/components/ProtectedRoute';

const OnboardingPage: React.FC = () => {
  return (
    <ProtectedRoute>
      <Onboarding />
    </ProtectedRoute>
  );
};

export default OnboardingPage;
