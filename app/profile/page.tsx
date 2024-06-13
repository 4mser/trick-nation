'use client';

import React, { useState, useEffect } from 'react';
import useCurrentUser from '@/hooks/useCurrentUser';
import ProtectedRoute from '@/components/ProtectedRoute';
import LogoutButton from '@/components/LogoutButton';
import EditProfileForm from '@/components/EditProfileForm';
import VideoModal from '@/components/VideoModal';
import api from '@/services/api';
import { useRouter } from 'next/navigation';
import { UserTrick } from '@/types/usertrick';
import Loader from '@/components/Loader';
import Image from 'next/image';
import { motion } from 'framer-motion';

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
  const { user, loading, refetch } = useCurrentUser();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTrick, setSelectedTrick] = useState<UserTrick | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const unlockedTricks = useUnlockedTricks(user?._id);

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción es permanente.');
    if (!confirmed) return;

    try {
      const token = localStorage.getItem('token');
      await api.delete('/auth/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      router.push('/Auth/login');
    } catch (error) {
      console.error('Failed to delete account:', error);
    }
  };

  const handleProfileUpdate = async () => {
    await refetch();
    setIsEditing(false);
  };

  const handleDeleteTrick = async (id: string) => {
    try {
      await api.delete(`/usertricks/${id}`);
      setSelectedTrick(null);
      refetch();
    } catch (error) {
      console.error('Failed to delete trick:', error);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, trickId: string) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        await api.patch(`/usertricks/${trickId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        refetch();
        setSelectedTrick(null);
      } catch (error) {
        console.error('Failed to update trick video:', error);
      }
    }
  };

  const totalTricks = 332;
  const progressPercentage = ((unlockedTricks.length / totalTricks) * 100).toFixed(1);

  if (loading) return <div className='w-full h-[100dvh] grid place-items-center'><Loader /></div>;
  if (!user) return <div>No user data</div>;

  return (
    <div className="bg-neutral-950 text-white shadow-lg pb-32 relative">
      {isEditing ? (
        <EditProfileForm onClose={() => setIsEditing(false)} onProfileUpdate={handleProfileUpdate} />
      ) : (
        <>
          <div className="relative p-5 bg-gradient-to-t from-neutral-900 to-transparent m-5 rounded-3xl shadow-lg">
            <div className="relative z-10 flex flex-col items-center text-center gap-2">
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.3 }}>
                <Image
                  src={user.profilePictureUrl || '/profile.jpeg'}
                  alt="Profile Picture"
                  width={96}
                  height={96}
                  className="w-24 h-24 object-cover rounded-3xl shadow-2xl shadow-white/30 cursor-pointer"
                  onClick={() => setIsModalOpen(true)}
                />
              </motion.div>
              <h2 className="text-2xl font-bold">{user.username}</h2>
              <p className="px-5 opacity-70 font-light">{user.description}</p>
              <p className="px-5 opacity-70 font-light">{user.roles.length > 0 ? user.roles[0] : 'Sin rol'}</p>
              {user.nucleus && (
                <div className="flex items-center gap-2 justify-between">
                  <Image
                    src={`/assets/nucleos/${user.nucleus.toLowerCase()}.svg`}
                    alt={user.nucleus}
                    width={24}
                    height={24}
                  />
                  <p className="opacity-70 font-light">{user.nucleus}</p>
                </div>
              )}
              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-neutral-800 border border-px border-white/0 hover:border-white/10 hover:bg-neutral-900 text-white p-2 rounded-md text-xs"
                >
                  Editar Perfil
                </button>
                <LogoutButton />
              </div>
            </div>
            <div className="m-6 space-y-2">
              <p className="text-white">Progreso: {progressPercentage}%</p>
              <div className="w-full h-2 bg-neutral-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-green-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1.5 }}
                />
              </div>
            </div>
            <ul className="relative z-10 bg-neutral-950 mx-5 py-2 flex justify-around rounded-full shadow-md">
              <li className="flex flex-col items-center">
                <p>{user.level}</p>
                <p className="text-xs opacity-50">Nivel</p>
              </li>
              <li className="flex flex-col items-center">
                <p>{user.experiencePoints}</p>
                <p className="text-xs opacity-50">XP</p>
              </li>
              <li className="flex flex-col items-center">
                <p>{user.skateCoinsBalance}</p>
                <p className="text-xs opacity-50">SC</p>
              </li>
            </ul>
          </div>

          <div className="mt-4">
            <h2 className="text-xl font-bold mb-2 text-center">Tokens</h2>
            {unlockedTricks.length > 0 ? (
              <div className="grid grid-cols-3 gap-1">
                {unlockedTricks.map((trick) => (
                  <div key={trick._id} className="relative aspect-square">
                    <div
                      className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 text-white text-xs p-1 text-center cursor-pointer"
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
              <p className="px-5 text-center opacity-60">Nada de momento.</p>
            )}
          </div>
        </>
      )}
      {selectedTrick && (
        <VideoModal
          trick={selectedTrick}
          onClose={() => setSelectedTrick(null)}
          onDelete={handleDeleteTrick}
          onFileChange={handleFileChange}
        />
      )}
      {isModalOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsModalOpen(false)}
        >
          <motion.div
            className="relative  rounded-lg"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            onClick={(e) => e.stopPropagation()} // Prevents modal from closing when clicking inside
          >
            <Image
              src={user.profilePictureUrl || '/profile.jpeg'}
              alt="Profile Picture"
              width={500}
              height={500}
              className="object-cover rounded-lg w-full h-full"
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default function Page() {
  return (
    <ProtectedRoute>
      <UserProfile />
    </ProtectedRoute>
  );
}
