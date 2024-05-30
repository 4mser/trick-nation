'use client'
import React, { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import TrickList from '@/components/TrickList';
import TrickTree from '@/components/TrickTree';

const HomePage: React.FC = () => {

  return (
    <ProtectedRoute>
        <TrickTree />
    </ProtectedRoute>
  );
};

export default HomePage;
