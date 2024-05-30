'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { User } from '../types/user';
import api from '@/services/api';
import VideoModal from '@/components/VideoModal';
import { UserTrick } from '@/types/usertrick';

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [unlockedTricks, setUnlockedTricks] = useState<UserTrick[]>([]);
  const [selectedTrick, setSelectedTrick] = useState<UserTrick | null>(null);
  const params = useParams();
  const { id } = params;

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

  useEffect(() => {
    const fetchUnlockedTricks = async () => {
      if (id) {
        const response = await api.get(`/usertricks/user/${id}`);
        setUnlockedTricks(response.data);
      }
    };
    fetchUnlockedTricks();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>No user data</div>;
  }

  return (
    <div className="text-white rounded-lg shadow-lg max-w-md mx-auto mb-20">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{user.username}</h2>
      </div>
      <p>{user.email}</p>
      <p>Level: {user.level}</p>
      <p>Experience Points: {user.experiencePoints}</p>
      <p>City: {user.city}</p>
      <p>Country: {user.country}</p>
      <img
        src={user.profilePictureUrl ? `${user.profilePictureUrl}` : '/profile.jpeg'}
        alt="Profile Picture"
        className="w-24 h-24 rounded-full mb-4"
      />

      <div className="mt-4">
        <h2 className="text-xl font-bold mb-2">Unlocked Tricks</h2>
        {unlockedTricks.length > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {unlockedTricks.map((trick) => (
              <div key={trick._id} className="relative">
                <div
                  className="absolute bottom-0 left-0 w-full bg-opacity-50 text-white text-xs p-1 text-center"
                  onClick={() => setSelectedTrick(trick)}
                >
                  {trick.trickId.name}
                </div>
                <video
                  onClick={() => setSelectedTrick(trick)}
                  className="w-full h-full object-cover cursor-pointer"
                  src={`http://localhost:3000${trick.videoUrl}`}
                  muted
                />
              </div>
            ))}
          </div>
        ) : (
          <p>No tricks unlocked yet.</p>
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
