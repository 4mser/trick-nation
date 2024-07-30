'use client';

import React, { useState, useEffect } from 'react';
import useCurrentUser from '@/hooks/useCurrentUser';
import ProtectedRoute from '@/components/ProtectedRoute';
import LogoutButton from '@/components/LogoutButton';
import EditProfileForm from '@/components/EditProfileForm';
import api from '@/services/api';
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

const UserProfile: React.FC = () => {
  const { user, loading, refetch } = useCurrentUser();
  const [isEditing, setIsEditing] = useState(false);
  const [allSpecies, setAllSpecies] = useState<Species[]>([]);
  const [unlockedSpecies, setUnlockedSpecies] = useState<string[]>([]);
  const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null);
  const [showSpeciesDrawer, setShowSpeciesDrawer] = useState(false);
  const [showAddSightingDrawer, setShowAddSightingDrawer] = useState(false);
  const [showPokedexDrawer, setShowPokedexDrawer] = useState(false);
  const [missionName, setMissionName] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [loadingSighting, setLoadingSighting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mission, setMission] = useState<any>(null);
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [showSightingGalleryDrawer, setShowSightingGalleryDrawer] = useState(false);
  const [currentSightingIndex, setCurrentSightingIndex] = useState(0);

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

      // Filtrar especies desbloqueadas para eliminar duplicados
      const uniqueUnlockedSpeciesIds = Array.from(new Set(unlockedSpeciesIds)) as string[];
      setUnlockedSpecies(uniqueUnlockedSpeciesIds);

      if (response.data.missions.length > 0) {
        const missionId = response.data.missions[0];
        const missionResponse = await api.get(`/missions/${missionId}`);
        setMissionName(missionResponse.data.name);
        setMission(missionResponse.data);
      }
    } catch (error) {
      console.error('Failed to fetch unlocked species:', error);
    }
  };

  const fetchSightingsForSpecies = async (speciesId: string) => {
    try {
      const response = await api.get(`/users/${user?._id}/sightings/${speciesId}`);
      setSightings(response.data);
      setCurrentSightingIndex(0);  // Reset to the first sighting
    } catch (error) {
      console.error('Failed to fetch sightings for species:', error);
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

  const handleSpeciesClick = async (species: Species) => {
    setSelectedSpecies(species);
    await fetchSightingsForSpecies(species._id);
    setShowSpeciesDrawer(true);
  };

  const handleAddSightingClick = () => {
    setShowSpeciesDrawer(false);
    setShowAddSightingDrawer(true);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSightingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !selectedSpecies || !user) return;

    setLoadingSighting(true);

    const formData = new FormData();
    formData.append('speciesId', selectedSpecies._id);
    formData.append('userId', user._id);
    formData.append('file', file);

    try {
      await api.patch(`/missions/${mission._id}/sightings`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(percentCompleted);
          }
        }
      });
      fetchUnlockedSpecies();
      setShowAddSightingDrawer(false);
    } catch (error) {
      console.error('Failed to report sighting:', error);
    } finally {
      setLoadingSighting(false);
      setProgress(0);
      setFile(null);
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

  const isUserParticipating = user && mission?.participants.some((participant: any) => {
    const participantId = typeof participant === 'string' ? participant : participant._id;
    return participantId.toString() === user._id.toString();
  });

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
            {isUserParticipating && (
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
                <div className="relative flex flex-wrap justify-center pt-3 gap-2  max-h-24 overflow-hidden">
                  <div className='bottom-0 left-0 w-full h-10 absolute bg-gradient-to-b from-transparent to-neutral-900' />
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
                    {isUserParticipating && !unlockedSpecies.includes(selectedSpecies._id) && (
                      <section className='p-4 mb-4'>
                        <div className='flex justify-center'>
                          <Button
                            className="bg-gradient-to-br from-yellow-600/70  to-transparent backdrop-blur-md p-2 rounded-md w-full"
                            onClick={handleAddSightingClick}
                          >
                            Reportar Avistamiento
                          </Button>
                        </div>
                      </section>
                    )}
                    {sightings.length > 0 && (
                      <div className='mt-4'>
                        <Button
                            className="bg-gradient-to-br from-green-600/70  mb-2 to-transparent backdrop-blur-md p-2 rounded-md w-full"
                            onClick={() => {
                              setShowAddSightingDrawer(true);
                              setShowSpeciesDrawer(false);
                            }}
                          >
                            Reportar otro avistamiento
                          </Button>
                        <h3 className="text-md font-semibold text-white">Tus avistamientos:</h3>
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
                  </div>
                </DrawerDescription>
                <DrawerClose />
              </DrawerContent>
            </Drawer>
          )}

          {selectedSpecies && (
            <Drawer open={showAddSightingDrawer} onOpenChange={handleDrawerClose}>
              <DrawerContent className='bg-white/5 border-none backdrop-blur-md rounded-t-3xl outline-none'>
                <DrawerTitle>
                  <h1 className="w-full text-center text-xl font-bold my-2 text-white">Reportar Avistamiento</h1>
                </DrawerTitle>
                <DrawerDescription>
                  <div className='p-4'>
                    <form onSubmit={handleSightingSubmit}>
                      <div className="">
                        <label className="custom-file-label">
                          Subir Imagen:
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          required
                          className="custom-file-input"
                        />
                        </label>
                      </div>
                      {loadingSighting && (
                        <div className="mb-4">
                          <Progress value={progress} className="w-full bg-green-600 h-2" />
                        </div>
                      )}
                      <DrawerFooter className="flex justify-end p-0 py-4">
                        <button type="submit" className="bg-gradient-to-br from-green-600/60 to-transparent  text-white px-4 py-2 rounded-md" disabled={loadingSighting}>
                          {loadingSighting ? `subiendo... ${progress}%` : 'Subir'}
                        </button>
                        <DrawerClose asChild>
                          <button className="text-white px-4 py-2 rounded" onClick={() => setShowAddSightingDrawer(false)}>Cancelar</button>
                        </DrawerClose>
                      </DrawerFooter>
                    </form>
                  </div>
                </DrawerDescription>
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
                <div className="flex flex-col">
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
                      className="w-full max-h-[50dvh] object-cover"
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
