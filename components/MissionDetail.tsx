'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/services/api';
import { useAuth } from '@/context/auth-context';
import { Mission, Species } from '@/types/mission';
import AddSpeciesModal from './AddSpeciesModal';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion } from 'framer-motion';
import Image from 'next/image';
import { User } from '@/types/user';

interface MissionDetailProps {
  missionId: string;
}

const MissionDetail: React.FC<MissionDetailProps> = ({ missionId }) => {
  const [mission, setMission] = useState<Mission | null>(null);
  const [showAddSpeciesModal, setShowAddSpeciesModal] = useState(false);
  const [showSpeciesDrawer, setShowSpeciesDrawer] = useState(false);
  const [showAddSightingDrawer, setShowAddSightingDrawer] = useState(false);
  const [showRankingDrawer, setShowRankingDrawer] = useState(false);
  const { user } = useAuth();
  const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ranking, setRanking] = useState<{ user: User, speciesCount: number }[]>([]);

  const fetchMission = async () => {
    try {
      const response = await api.get(`/missions/${missionId}`);
      setMission(response.data);
    } catch (error) {
      console.error('Failed to fetch mission:', error);
    }
  };

  const fetchRanking = async () => {
    try {
      if (mission) {
        const participantIds = mission.participants.map((participant: any) => {
          if (typeof participant === 'string') {
            return participant;
          } else if (participant && '_id' in participant) {
            return participant._id.toString();
          } else {
            return null;
          }
        }).filter(Boolean);

        const participantData = await Promise.all(
          participantIds.map(async (participantId) => {
            const response = await api.get(`/users/${participantId}`);
            return response.data;
          })
        );

        const rankingData = participantData.map((participant: User) => {
          const uniqueSpecies = new Set(participant.sightings.map((sighting: any) => sighting.species.toString()));
          return { user: participant, speciesCount: uniqueSpecies.size };
        });

        rankingData.sort((a, b) => b.speciesCount - a.speciesCount);
        setRanking(rankingData);
      }
    } catch (error) {
      console.error('Failed to fetch ranking:', error);
    }
  };

  const handleJoinMission = async () => {
    try {
      if (user) {
        await api.patch(`/missions/${missionId}/join`, { userId: user._id });
        fetchMission();
      }
    } catch (error) {
      console.error('Failed to join mission:', error);
    }
  };

  useEffect(() => {
    fetchMission();
  }, [missionId]);

  const handleSpeciesClick = (species: Species) => {
    setSelectedSpecies(species);
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

  const handleSightingDrawerClose = (isOpen: boolean) => {
    if (!isOpen) {
      setShowAddSightingDrawer(false);
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

    setLoading(true);

    const formData = new FormData();
    formData.append('speciesId', selectedSpecies._id);
    formData.append('userId', user._id);
    formData.append('file', file);

    try {
      await api.patch(`/missions/${missionId}/sightings`, formData, {
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
      fetchMission();
      setShowAddSightingDrawer(false);
    } catch (error) {
      console.error('Failed to report sighting:', error);
    } finally {
      setLoading(false);
      setProgress(0);
      setFile(null);
    }
  };

  const isUserParticipating = user && mission?.participants.some((participant: any) => {
    const participantId = typeof participant === 'string' ? participant : participant._id;
    return participantId.toString() === user._id.toString();
  });

  return (
    <div className="w-full pb-20 text-white">
      {mission && (
        <>
          <div className='relative w-full h-48 overflow-hidden'>
            <div className='absolute bottom-0 w-full h-32 bg-gradient-to-b from-transparent to-neutral-950' />
            <img src={mission.imageUrl} alt={mission.name} className=" w-full h-full  object-cover mb-4" />
          </div>

          <div className='p-4'>
            <h1 className="text-2xl font-bold mb-2">{mission.name}</h1>
            <p className="mb-2">Dificultad: {mission.difficulty}</p>
          </div>
          {!isUserParticipating && user && (
            <button
              className="bg-yellow-500 text-white p-2 rounded mb-4"
              onClick={handleJoinMission}
            >
              Unirte a la misión!
            </button>
          )}
          {isUserParticipating && (
            <>
              <Button className="mx-4 mb-4" onClick={() => { fetchRanking(); setShowRankingDrawer(true); }}>
                Ver Ranking de Misión
              </Button>
              <button
                className="fixed hover:scale-105 z-10  bottom-12 shadow-lg right-4 bg-gradient-to-br from-yellow-600/70 border-2 border-yellow-500/80 to-transparent backdrop-blur-md  text-yellow-500 p-2 text-2xl  rounded-full w-12 h-12 flex justify-center items-center mb-4"
                onClick={() => setShowAddSpeciesModal(true)}
              >
                + 
              </button>
              <h2 className="text-xl font-bold mb-2 px-4">Especies</h2>
              <div className="grid grid-cols-3 md:grid-cols-2 gap-2 p-4">
                {mission.species.map((species) => (
                  <motion.div
                    key={species._id}
                    className="bg-gradient-to-br  border-yellow-400/10 from-yellow-600/20 to-transparent text-white rounded shadow-lg cursor-pointer overflow-hidden"
                    onClick={() => handleSpeciesClick(species)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img src={species.imageUrl} alt={species.name} className="w-full h-28 object-cover" />
                    <div className='p-2'>
                      <h3 className="text-sm font-semibold text-yellow-500/80">{species.name}</h3>
                      <p className="text-xs font-light opacity-70">{species.scientificName}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
          {showAddSpeciesModal && (
            <AddSpeciesModal
              missionId={mission._id}
              onClose={() => setShowAddSpeciesModal(false)}
              onSpeciesAdded={fetchMission}
            />
          )}
          {selectedSpecies && (
            <Drawer open={showSpeciesDrawer} onOpenChange={handleDrawerClose}>
              <DrawerContent className='bg-white/5 border-none backdrop-blur-md rounded-t-3xl outline-none'>
                <DrawerTitle>
                  <h1 className="w-full text-center text-xl font-bold my-2 text-white">{selectedSpecies.name}</h1>
                  <p className='text-center text-white/70 text-xs font-normal'>{selectedSpecies.scientificName}</p>
                </DrawerTitle>
                <DrawerDescription>
                  <div className='p-4'>
                    <img
                      src={selectedSpecies.imageUrl}
                      alt={selectedSpecies.name}
                      className="w-full max-h-[65dvh] object-cover rounded-md"
                    />
                  </div>
                  <section className='px-4 mb-5'>
                    <div className='flex justify-center'>
                      <Button
                        className="bg-gradient-to-br from-yellow-600/70  to-transparent backdrop-blur-md p-2 rounded-md w-full"
                        onClick={handleAddSightingClick}
                      >
                        Reportar Avistamiento
                      </Button>
                    </div>
                  </section>
                </DrawerDescription>
                <DrawerClose />
              </DrawerContent>
            </Drawer>
          )}
          {selectedSpecies && (
            <Drawer open={showAddSightingDrawer} onOpenChange={handleSightingDrawerClose}>
              <DrawerContent className='bg-white/5 border-none backdrop-blur-md rounded-t-3xl outline-none'>
                <DrawerTitle>
                  <h1 className="w-full text-center text-xl font-bold my-2 text-white">Reportar Avistamiento</h1>
                </DrawerTitle>
                <DrawerDescription>
                  <div className='p-4'>
                    <form onSubmit={handleSightingSubmit}>
                      <div className="mb-4">
                        <label className="block text-gray-300 mb-2">Subir Imagen:</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          required
                          className="w-full p-2 border border-white/30 rounded-md bg-transparent text-white"
                        />
                      </div>
                      {loading && (
                        <div className="mb-4">
                          <Progress value={progress} className="w-full bg-yellow-600 h-2" />
                        </div>
                      )}
                      <DrawerFooter className="flex justify-end p-0 py-4">
                        <button type="submit" className="bg-gradient-to-br from-yellow-600/60 to-transparent  text-white px-4 py-2 rounded-md" disabled={loading}>
                          {loading ? `subiendo... ${progress}%` : 'Subir'}
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
          <Drawer open={showRankingDrawer} onOpenChange={(isOpen) => setShowRankingDrawer(isOpen)}>
            <DrawerContent className='bg-white/5 border-none backdrop-blur-md rounded-t-3xl outline-none max-h-[100dvh]'>
              <DrawerTitle>
                <h1 className="w-full text-center text-xl font-bold my-2 text-white">Ranking de Avistamientos</h1>
              </DrawerTitle>
              <DrawerDescription className='overflow-y-auto'>
                <div className='p-4'>
                  <ol className="list-decimal list-inside">
                    {ranking.map((entry, index) => (
                      <li key={entry.user._id} className="mb-2 flex justify-between items-center">
                        <Link href={`/users/${entry.user._id}`}>
                          <div className="flex items-center cursor-pointer">
                            <span className="mr-2">{index + 1}.</span>
                            <Image
                              src={entry.user.profilePictureUrl || '/profile.jpeg'}
                              alt="Profile Picture"
                              width={40}
                              height={40}
                              className="rounded-full w-10 h-10 object-cover"
                            />
                            <span className="ml-2 text-white/80">{entry.user.username}</span>
                          </div>
                        </Link>
                        <span>{entry.speciesCount} especies</span>
                      </li>
                    ))}
                  </ol>
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

export default MissionDetail;
