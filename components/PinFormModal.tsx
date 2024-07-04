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
import { Button } from "@/components/ui/button"; // Asegúrate de que el componente Button esté importado correctamente

interface PinFormDrawerProps {
  onClose: () => void;
  userLocation: [number, number] | null;
  userId: string;
  onPinCreated: () => void;
}

const PinFormModal: React.FC<PinFormDrawerProps> = ({ onClose, userLocation, userId, onPinCreated }) => {
  const [name, setName] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userLocation) return;

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
      });
      onPinCreated();
      onClose();
    } catch (error) {
      console.error('Failed to create Pin:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <Drawer open={true} onOpenChange={onClose}>
      <DrawerTrigger />
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Deja un Pin en el mapa</DrawerTitle>
          <DrawerDescription>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Comentario:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full p-2 border border-gray-300 rounded bg-transparent text-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Cargar Archivo:</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full rounded bg-transparent text-white/70"
                />
              </div>
              <DrawerFooter>
                <Button type="submit" className="bg-yellow-500 text-white px-4 py-2 rounded mr-2">Subir</Button>
                <DrawerClose asChild>
                  <Button variant="outline" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">Cancelar</Button>
                </DrawerClose>
              </DrawerFooter>
            </form>
          </DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
};

export default PinFormModal;
