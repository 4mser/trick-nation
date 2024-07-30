'use client';

import React, { useEffect, useState } from 'react';
import api from '@/services/api';
import { useParams } from 'next/navigation';
import { Species, Sighting } from '@/types/mission';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { User } from '@/types/user';

const UserProfile: React.FC = () => {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [allSpecies, setAllSpecies] = useState<Species[]>([]);
  const [unlockedSpecies, setUnlockedSpecies] = useState<string[]>([]);
  const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null);
  const [showSpeciesDrawer, setShowSpeciesDrawer] = useState(false);
  const [showPokedexDrawer, setShowPokedexDrawer] = useState(false);
  const [missionName, setMissionName] = useState<string>('');
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [showSightingGalleryDrawer, setShowSightingGalleryDrawer] = useState(false);
  const [currentSightingIndex, setCurrentSightingIndex] = useState(0);

  const fetchUserData = async () => {
    try {
      const response = await api.get(`/users/${id}`);
      setUser(response.data);
      setUnlockedSpecies(response.data.sightings.map((sighting: any) => sighting.species.toString()));

      if (response.data.missions.length > 0) {
        const missionId = response.data.missions[0];
        const missionResponse = await api.get(`/missions/${missionId}`);
        setMissionName(missionResponse.data.name);
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllSpecies = async () => {
    try {
      const response = await api.get('/species');
      setAllSpecies(response.data);
    } catch (error) {
      console.error('Failed to fetch all species:', error);
    }
  };

  const fetchSightingsForSpecies = async (speciesId: string) => {
    try {
      const response = await api.get(`/users/${id}/sightings/${speciesId}`);
      setSightings(response.data);
      setCurrentSightingIndex(0);  // Reset to the first sighting
    } catch (error) {
      console.error('Failed to fetch sightings for species:', error);
    }
  };

  useEffect(() => {
    fetchAllSpecies();
    fetchUserData();
  }, [id]);

  const handleSpeciesClick = async (species: Species) => {
    setSelectedSpecies(species);
    await fetchSightingsForSpecies(species._id);
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

  const handleSightingGalleryDrawerClose = (isOpen: boolean) => {
    if (!isOpen) {
      setShowSightingGalleryDrawer(false);
    }
  };

  const handlePrevImage = () => {
    setCurrentSightingIndex((prevIndex) => (prevIndex - 1 + sightings.length) % sightings.length);
  };

  const handleNextImage = () => {
    setCurrentSightingIndex((prevIndex) => (prevIndex + 1) % sightings.length);
  };

  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.x < -100) {
      handleNextImage();
    } else if (info.offset.x > 100) {
      handlePrevImage();
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>No user data</div>;

  const progressPercentage = ((unlockedSpecies.length / allSpecies.length) * 100).toFixed(1);

  return (
    <div className="bg-neutral-950 text-white shadow-lg pb-32 relative">
      <div className="relative p-5 bg-gradient-to-t from-neutral-900 to-transparent m-5 rounded-3xl shadow-lg">
        <div className="relative z-10 flex flex-col items-center text-center gap-2">
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 0.3 }}>
            <Image
              src={user.profilePictureUrl || '/profile.jpeg'}
              alt="Profile Picture"
              width={96}
              height={96}
              className="w-24 h-24 object-cover rounded-3xl shadow-2xl shadow-white/30"
            />
          </motion.div>
          <h2 className="text-2xl font-bold">{user.username}</h2>
          <p className="px-5 opacity-70 font-light">{user.description}</p>
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
          {user.missions.length > 0 && (
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
              <div className="relative flex flex-wrap justify-center pt-3 gap-2 min-h-20 max-h-24 overflow-hidden">
                <div className='bottom-0 left-0 w-full h-10 absolute bg-gradient-to-b from-transparent  to-neutral-900' />
                {unlockedSpecies.map((speciesId) => {
                  const species = allSpecies.find((s) => s._id === speciesId);
                  return species ? (
                    <motion.div
                      key={species._id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSpeciesClick(species)}
                      className="cursor-pointer"
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
          )}
          {/* <ul className="z-10 bg-neutral-950 w-full py-2 flex justify-around rounded-full shadow-md">
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
          </ul> */}
        </div>
      </div>

      {selectedSpecies && (
        <Drawer open={showSpeciesDrawer} onOpenChange={handleDrawerClose}>
          <DrawerContent className='bg-white/5 border-none backdrop-blur-md rounded-t-3xl outline-none max-h-[100dvh]'>
            <DrawerTitle>
              <h1 className="w-full text-center text-xl font-bold mt-2 text-white">{selectedSpecies.name}</h1>
              <p className="text-white/70 font-normal text-xs text-center"><b></b> {selectedSpecies.scientificName}</p>
            </DrawerTitle>
            <DrawerDescription className='overflow-y-auto'>
              <div className='p-4'>
                <img
                  src={selectedSpecies.imageUrl}
                  alt={selectedSpecies.name}
                  className="w-full max-h-[50dvh] object-cover rounded-md"
                />
              </div>
              {sightings.length > 0 && (
                <div className='px-4 pb-4'>
                  <h3 className="text-md font-semibold text-white">Avistamientos:</h3>
                  <div className='grid grid-cols-3 gap-2 mt-2'>
                    {sightings.map((sighting, index) => (
                      <img
                        key={sighting._id}
                        src={sighting.imageUrl}
                        alt="Sighting"
                        className="w-full h-20 object-cover rounded-md cursor-pointer"
                        onClick={() => {
                          setCurrentSightingIndex(index);
                          setShowSightingGalleryDrawer(true);
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </DrawerDescription>
            <DrawerClose />
          </DrawerContent>
        </Drawer>
      )}

      <Drawer open={showPokedexDrawer} onOpenChange={handlePokedexDrawerClose}>
        <DrawerContent className='bg-white/5 border-none backdrop-blur-md rounded-t-3xl outline-none max-h-[100dvh]'>
          <DrawerTitle>
            <h1 className="w-full text-center text-xl font-bold my-2 text-white">Medallas</h1>
          </DrawerTitle>
          <DrawerDescription className='overflow-y-auto'>
            <div className="flex flex-wrap gap-2 p-4 items-center justify-center">
              {allSpecies.map((species) => (
                <motion.div
                  key={species._id}
                  className={`border w-10 h-10 ${unlockedSpecies.includes(species._id) ? 'border-green-500' : 'border-gray-700'} text-white rounded-full shadow-lg overflow-hidden`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSpeciesClick(species)}
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

      <Drawer open={showSightingGalleryDrawer} onOpenChange={handleSightingGalleryDrawerClose}>
        <DrawerContent className='bg-white/5 border-none backdrop-blur-md rounded-t-3xl outline-none max-h-[100dvh]'>
          <DrawerTitle>
            <h1 className="w-full text-center text-xl font-bold my-2 text-white">Galería de Avistamientos</h1>
          </DrawerTitle>
          <DrawerDescription className='overflow-y-auto pb-10'>
            <div className="flex flex-col ">
              <AnimatePresence mode='wait'>
                <motion.img
                  key={sightings[currentSightingIndex]?._id}
                  src={sightings[currentSightingIndex]?.imageUrl}
                  alt="Sighting"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  drag="x"
                  onDragEnd={handleDragEnd}
                  className="w-full max-h-[60dvh] object-cover"
                />
              </AnimatePresence>
              <div className='grid grid-cols-3 gap-2 p-4'>
                {sightings.map((sighting, index) => (
                  <img
                    key={sighting._id}
                    src={sighting.imageUrl}
                    alt="Sighting"
                    className={`w-full h-20 object-cover rounded-md cursor-pointer ${index === currentSightingIndex ? 'border-2 border-green-500' : ''}`}
                    onClick={() => setCurrentSightingIndex(index)}
                  />
                ))}
              </div>
            </div>
          </DrawerDescription>
          <DrawerClose />
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default UserProfile;
