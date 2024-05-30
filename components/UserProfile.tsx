'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { User } from '../types/user';
import api from '@/services/api';
import VideoModal from '@/components/VideoModal';
import { UserTrick } from '@/types/usertrick';

const useUnlockedTricks = (userId: string | undefined) => {
  const [unlockedTricks, setUnlockedTricks] = useState<UserTrick[]>([]);

  useEffect(() => {
    const fetchUnlockedTricks = async () => {
      if (userId) {
        const response = await api.get(`/usertricks/user/${userId}`);
        setUnlockedTricks(response.data);
      }
    };
    fetchUnlockedTricks();
  }, [userId]);

  return unlockedTricks;
};

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTrick, setSelectedTrick] = useState<UserTrick | null>(null);
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const unlockedTricks = useUnlockedTricks(id);

  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        try {
          const response = await api.get<User>(`/users/${id}`);
          setUser(response.data);
        } catch (error) {
          console.error('Failed to fetch user:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    }
  }, [id]);

  const totalTricks = 332;
  const progressPercentage = ((unlockedTricks.length / totalTricks) * 100).toFixed(1);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>No user data</div>;
  }

  return (
    <div className="bg-neutral-950 text-white shadow-lg pb-32 relative">
      <div className="relative p-5 bg-gradient-to-t from-neutral-900 to-transparent m-5 rounded-3xl">
        <div className="relative z-10 flex flex-col items-center text-center gap-2">
          <img
            src={user.profilePictureUrl || '/profile.jpeg'}
            alt="Profile Picture"
            className="w-24 h-24 object-cover rounded-3xl shadow-2xl shadow-white/30"
          />
          <h2 className="text-2xl font-bold">{user.username}</h2>
          <p className="px-5 opacity-70 font-light">{user.description}</p>
        </div>
        <div className="m-6 space-y-2">
          <p className="text-white">Progreso trucos: {progressPercentage}%</p>
          <div className="w-full h-2 bg-neutral-700 rounded-full">
            <div className="h-full bg-green-400 rounded-full" style={{ width: `${progressPercentage}%` }} />
          </div>
        </div>
        <ul className="relative z-10 bg-neutral-950 mx-5 py-2 flex justify-around rounded-full ">
          <li className="flex flex-col items-center">
            <p>{user.level}</p>
            <p className="text-xs opacity-50">Nivel</p>
          </li>
          <li className="flex flex-col items-center">
            <p>{user.experiencePoints}</p>
            <p className="text-xs opacity-50">XP</p>
          </li>
          
        </ul>
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-bold mb-2 text-center">Trucos</h2>
        {unlockedTricks.length > 0 ? (
          <div className="grid grid-cols-3 gap-1">
            {unlockedTricks.map((trick) => (
              <div key={trick._id} className="relative aspect-square">
                <div
                  className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white text-xs p-1 text-center"
                  onClick={() => setSelectedTrick(trick)}
                >
                  {trick.trickId.name}
                </div>
                <video
                  onClick={() => setSelectedTrick(trick)}
                  className="w-full h-full object-cover cursor-pointer"
                  src={`${trick.videoUrl}#t=0.1`}
                  poster=""
                  playsInline
                  controls={false}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="px-5">Sin trucos aún.</p>
        )}
      </div>
      {selectedTrick && (
        <VideoModal
          trick={selectedTrick}
          onClose={() => setSelectedTrick(null)}
          onDelete={() => {}}
          onFileChange={() => {}}
          readOnly // Propiedad adicional para indicar que no se puede editar ni eliminar
        />
      )}
    </div>
  );
};

export default UserProfile;