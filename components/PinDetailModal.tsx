'use client';

import React, { useEffect, useState } from 'react';
import { Pin } from '../types/pins';
import { useAuth } from '@/context/auth-context';
import api from '@/services/api';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import Loader from '@/components/Loader';

interface PinDetailDrawerProps {
  pin: Pin | null;
  onClose: () => void;
}

const PinDetailModal: React.FC<PinDetailDrawerProps> = ({ pin, onClose }) => {
  const { user } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (pin) {
      setDrawerOpen(true);
    } else {
      setDrawerOpen(false);
    }
  }, [pin]);

  const handleDrawerClose = (isOpen: boolean) => {
    if (!isOpen) {
      setDrawerOpen(false);
      setTimeout(onClose, 300); // Delay onClose to allow for smooth transition
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this pin?');
    if (!confirmed) return;

    try {
      setLoading(true);
      await api.delete(`/pins/${pin?._id}`);
      router.push('/');
    } catch (error) {
      console.error('Failed to delete pin:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!pin) return null;

  const isCreator = user && pin.discoveredByUserId && user._id === pin.discoveredByUserId._id;

  return (
    <Drawer open={drawerOpen} onOpenChange={handleDrawerClose}>
      <DrawerContent className="dark backdrop-blur-md rounded-t-3xl outline-none">
        <DrawerHeader>
          <DrawerTitle className="text-white text-center">{pin.name}</DrawerTitle>
          <DrawerDescription>
            <p className='mb-1'>{pin.discoveredByUserId.username}</p>
            <p className='mb-2 text-xs'>{new Date(pin.createdAt).toLocaleString()}</p>
            <div className="relative w-full">
              {pin.imageUrl && (
                <img
                  src={`${pin.imageUrl}`}
                  alt={pin.name}
                  className="w-full max-h-[65dvh] rounded-md object-cover"
                />
              )}
            </div>
              {isCreator && (
                <div className="absolute top-4 right-4">
                  <Button
                    onClick={handleDelete}
                    className="bg-red-500/20 border w-9 h-9 border-red-500 text-white p-2 rounded-full flex items-center justify-center"
                    disabled={loading}
                  >
                    {loading ? <Loader /> : <img src="/assets/icons/delete.svg" alt="Delete" className="w-5 h-5" />}
                  </Button>
                </div>
              )}
          </DrawerDescription>
        </DrawerHeader>
          <DrawerClose asChild>
          </DrawerClose>
      </DrawerContent>
    </Drawer>
  );
};

export default PinDetailModal;
