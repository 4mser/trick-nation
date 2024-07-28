'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import MissionDetail from '@/components/MissionDetail';
import ProtectedRoute from '@/components/ProtectedRoute';

const MissionDetailPage: React.FC = () => {
  const params = useParams();
  const id = params.id as string;

  if (!id) {
    return <div>Loading...</div>;
  }

  return (
    <ProtectedRoute>
      <MissionDetail missionId={id} />
    </ProtectedRoute>
  );
};

export default MissionDetailPage;
