'use client';

import React, { useState, useEffect } from 'react';
import useCurrentUser from '@/hooks/useCurrentUser';
import ProtectedRoute from '@/components/ProtectedRoute';
import LogoutButton from '@/components/LogoutButton';
import EditProfileForm from '@/components/EditProfileForm';
import api from '@/services/api';
import { Species } from '@/types/mission';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

const UserProfile: React.FC = () => {
  const { user, loading, refetch } = useCurrentUser();
  const [isEditing, setIsEditing] = useState(false);
  const [allSpecies, setAllSpecies] = useState<Species[]>([]);
  const [unlockedSpecies, setUnlockedSpecies] = useState<string[]>([]);
  const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null);
  const [showSpeciesDrawer, setShowSpeciesDrawer] = useState(false);
  const [showPokedexDrawer, setShowPokedexDrawer] = useState(false);
  const [missionName, setMissionName] = useState<string>('');

  const fetchAllSpecies = async () => {
    try {
      const response = await api.get('/species');
      setAllSpecies(response.data);
    } catch (error) {
      console.error('Failed to fetch all species:', error);
    }
  };

  const fetchUnlockedSpecies = async () => {
    try {
      const response = await api.get(`/users/${user?._id}`);
      const unlockedSpeciesIds = response.data.sightings.map((sighting: any) => sighting.species.toString());
      setUnlockedSpecies(unlockedSpeciesIds);

      if (response.data.missions.length > 0) {
        const missionId = response.data.missions[0];
        const missionResponse = await api.get(`/missions/${missionId}`);
        setMissionName(missionResponse.data.name);
      }
    } catch (error) {
      console.error('Failed to fetch unlocked species:', error);
    }
  };

  useEffect(() => {
    fetchAllSpecies();
    if (user) {
      fetchUnlockedSpecies();
    }
  }, [user]);

  const handleProfileUpdate = async () => {
    await refetch();
    setIsEditing(false);
  };

  const handleSpeciesClick = (species: Species) => {
    setSelectedSpecies(species);
    setShowSpeciesDrawer(true);
  };

  const handleDrawerClose = (isOpen: boolean) => {
    if (!isOpen) {
      setShowSpeciesDrawer(false);
    }
  };

  const handlePokedexDrawerClose = (isOpen: boolean) => {
    if (!isOpen) {
      setShowPokedexDrawer(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>No user data</div>;

  const progressPercentage = ((unlockedSpecies.length / allSpecies.length) * 100).toFixed(1);

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
                  onClick={() => setIsEditing(true)}
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
              <p className="text-white">Progreso misión {missionName}: {progressPercentage}%</p>
              <div className="w-full h-2 bg-neutral-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-green-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1.5 }}
                />
              </div>
              <div className="flex justify-center mt-4">
                {unlockedSpecies.map((speciesId) => {
                  const species = allSpecies.find((s) => s._id === speciesId);
                  return species ? (
                    <motion.div
                      key={species._id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSpeciesClick(species)}
                      className="cursor-pointer mx-2 pt-2"
                    >
                      <img
                        src={species.imageUrl}
                        alt={species.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-green-500"
                      />
                    </motion.div>
                  ) : null;
                })}
              </div>
              <div className="flex justify-center mt-4">
                <div
                  onClick={() => setShowPokedexDrawer(true)}
                  className='pt-3 opacity-85 hover:cursor-pointer hover:opacity-100'
                >
                  Ver todas las medallas
                </div>
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

          {selectedSpecies && (
            <Drawer open={showSpeciesDrawer} onOpenChange={handleDrawerClose}>
              <DrawerContent className='bg-white/5 border-none backdrop-blur-md rounded-t-3xl outline-none'>
                <DrawerTitle>
                  <h1 className="w-full text-center text-xl font-bold my-2 text-white">{selectedSpecies.name}</h1>
                </DrawerTitle>
                <DrawerDescription>
                  <div className='p-4'>
                    <img
                      src={selectedSpecies.imageUrl}
                      alt={selectedSpecies.name}
                      className="w-full max-h-[65dvh] object-cover rounded-md"
                    />
                    {/* <p className="mt-4 text-white">{selectedSpecies.description}</p> */}
                    <p className="mt-2 text-white"><b>Nombre Científico:</b> {selectedSpecies.scientificName}</p>
                  </div>
                </DrawerDescription>
                <DrawerClose />
              </DrawerContent>
            </Drawer>
          )}

          <Drawer open={showPokedexDrawer} onOpenChange={handlePokedexDrawerClose}>
            <DrawerContent className='bg-white/5 border-none backdrop-blur-md rounded-t-3xl outline-none'>
              <DrawerTitle>
                <h1 className="w-full text-center text-xl font-bold my-2 text-white">Medallas</h1>
              </DrawerTitle>
              <DrawerDescription>
                <div className="flex flex-wrap gap-2 p-4 items-center justify-center">
                  {allSpecies.map((species) => (
                    <motion.div
                      key={species._id}
                      className={`border w-10 h-10 ${unlockedSpecies.includes(species._id) ? 'border-green-500' : 'border-gray-700'} text-white rounded-full shadow-lg overflow-hidden`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => unlockedSpecies.includes(species._id) && handleSpeciesClick(species)}
                    >
                      <img
                        src={species.imageUrl}
                        alt={species.name}
                        className={`w-full h-full object-cover rounded-full ${unlockedSpecies.includes(species._id) ? '' : 'opacity-30'}`}
                      />
                    </motion.div>
                  ))}
                </div>
              </DrawerDescription>
              <DrawerClose />
            </DrawerContent>
          </Drawer>
        </>
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
