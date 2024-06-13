'use client';

import React from 'react';
import Map from '@/components/Map';
import ProtectedRoute from '@/components/ProtectedRoute';

const MapPage: React.FC = () => {
  return (
    <ProtectedRoute>
        <Map />
    </ProtectedRoute>
  );
};

export default MapPage;
