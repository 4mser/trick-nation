'use client';

import React, { useState } from 'react';
import api from '@/services/api';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import axios from 'axios';

interface PinFormDrawerProps {
  userLocation: [number, number] | null;
  userId: string;
  onPinCreated: () => void;
}

const PinFormDrawer: React.FC<PinFormDrawerProps> = ({ userLocation, userId, onPinCreated }) => {
  const [name, setName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userLocation) return;

    setLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('discoveredByUserId', userId);
    formData.append('location[type]', 'Point');
    formData.append('location[coordinates][0]', userLocation[0].toString());
    formData.append('location[coordinates][1]', userLocation[1].toString());
    if (file) {
      formData.append('file', file);
    }

    try {
      await api.post('/pins', formData, {
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
      onPinCreated();
      setDrawerOpen(false);
    } catch (error) {
      console.error('Failed to create Pin:', error);
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
      <DrawerTrigger asChild>
        <Button className='absolute right-0 bottom-3 w-14 h-14 rounded-full overflow-hidden flex justify-center items-center bg-gradient-to-tr from-yellow-500 to-yellow-800 p-[2px]'>
          <div className='flex justify-center items-center w-full h-full p-2.5 bg-black/30 backdrop-blur-3xl rounded-full'>
            <img src="../assets/map-icons/pin.svg" alt="Mark Pin" className='w-full filter hue-rotate-[210deg] h-full object-contain' />
          </div>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-white/10 backdrop-blur-md border-t border-white/10 rounded-t-3xl">
        <DrawerHeader>
          <DrawerTitle className="text-white text-center">Deja un Pin en el mapa</DrawerTitle>
          <DrawerDescription>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <Label className="block text-gray-300 mb-2">Comentario:</Label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded bg-transparent text-white"
                />
              </div>
              <div className="mb-4">
                <Label className="block text-gray-300 mb-2">Cargar Archivo:</Label>
                <Input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full rounded bg-transparent text-white"
                  style={{ color: 'white' }}
                />
              </div>
              {loading && (
                <div className="mb-4">
                  <Progress value={progress} className="w-full bg-yellow-600 h-2" />
                </div>
              )}
              <DrawerFooter className="flex justify-end">
                <Button type="submit" className="bg-yellow-500 text-white px-4 py-2 rounded" disabled={loading}>
                  {loading ? `Subiendo... ${progress}%` : 'Subir'}
                </Button>
                <DrawerClose asChild>
                  <Button className=" text-white px-4 py-2 rounded" onClick={() => setDrawerOpen(false)}>Cancelar</Button>
                </DrawerClose>
              </DrawerFooter>
            </form>
          </DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
};

export default PinFormDrawer;
