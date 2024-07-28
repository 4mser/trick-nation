'use client';

import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import { useAuth } from '@/context/auth-context';
import ProtectedRoute from '@/components/ProtectedRoute';
import MissionFormModal from '@/components/MissionFormModal';
import { useRouter } from 'next/navigation';
import { Mission } from '@/types/mission';

const MissionsPage: React.FC = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [showMissionForm, setShowMissionForm] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const fetchMissions = async () => {
    try {
      const response = await api.get('/missions');
      setMissions(response.data);
    } catch (error) {
      console.error('Failed to fetch missions:', error);
    }
  };

  useEffect(() => {
    fetchMissions();
  }, []);

  const handleMissionCreated = () => {
    fetchMissions();
    setShowMissionForm(false);
  };

  return (
    <ProtectedRoute>
      <div className="pb-14">
        {showMissionForm && user && user._id && (
          <MissionFormModal
            onClose={() => setShowMissionForm(false)}
            userId={user._id}
            onMissionCreated={handleMissionCreated}
          />
        )}
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4 text-white">Misiones</h1>
          <button
            className=" absolute bottom-14 right-4 bg-gradient-to-br from-yellow-400/40 to-transparent text-white p-2 rounded mb-4"
            onClick={() => setShowMissionForm(true)}
          >
            Crear Misión
          </button>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {missions.map((mission) => (
              <div
                key={mission._id}
                className="bg-gradient-to-tl from-yellow-400/40 via-yellow-400/10 to-transparent flex text-white p-4 rounded shadow-lg cursor-pointer h-full gap-4"
                onClick={() => router.push(`/missions/${mission._id}`)}
              >
                {/* <p className="mb-2">Start Date: {new Date(mission.startDate!).toLocaleDateString()}</p> */}
                {/* <p className="mb-2">End Date: {mission.endDate ? new Date(mission.endDate).toLocaleDateString() : 'N/A'}</p> */}
                <img src={mission.imageUrl} alt={mission.name} className="h-28 object-cover rounded" />
                <div>
                  <h2 className=" font-bold mb-2">{mission.name}</h2>
                  <p className="">Tipo: {mission.type}</p>
                  <p className="">Dificultad: {mission.difficulty}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default MissionsPage;
