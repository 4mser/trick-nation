'use client';

import React, { useEffect, useState } from 'react';
import { Pin } from '../types/pins';
import { useAuth } from '@/context/auth-context';
import api from '@/services/api';
import Link from 'next/link';
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
import Image from 'next/image';

interface PinDetailDrawerProps {
  pin: Pin | null;
  onClose: () => void;
}

const PinDetailModal: React.FC<PinDetailDrawerProps> = ({ pin, onClose }) => {
  const { user } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (pin) {
      setDrawerOpen(true);
      updateTimeLeft();
      const interval = setInterval(updateTimeLeft, 1000); // Update every second
      return () => clearInterval(interval);
    } else {
      setDrawerOpen(false);
    }
  }, [pin]);

  const updateTimeLeft = () => {
    if (!pin) return;
    const createdAt = new Date(pin.createdAt).getTime();
    const expiresAt = createdAt + 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const now = Date.now();
    const timeDiff = expiresAt - now;

    if (timeDiff <= 0) {
      setTimeLeft('Expired');
    } else {
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    }
  };

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
      <DrawerContent className="bg-white/5 border-none backdrop-blur-md rounded-t-3xl outline-none">
        <DrawerHeader>
          <DrawerTitle className="text-white text-center">{pin.name}</DrawerTitle>
          <DrawerDescription>
            <p className='mb-2 text-xs'>{new Date(pin.createdAt).toLocaleString()}</p>
            <p className='mb-2 text-xs'>Time left: {timeLeft}</p>
            <div className="relative w-full">
              {pin.imageUrl && (
                <img
                  src={`${pin.imageUrl}`}
                  alt={pin.name}
                  className="w-full max-h-[65dvh] rounded-md object-cover"
                />
              )}
            </div>
            <div className="flex items-center justify-between">
              <Link href={`/users/${pin.discoveredByUserId._id}`}>
                <div className="flex absolute bottom-7 left-7 items-center cursor-pointer">
                  <Image
                    src={pin.discoveredByUserId.profilePictureUrl || '/profile.jpeg'}
                    alt="Profile Picture"
                    width={40}
                    height={40}
                    className="rounded-full w-10 h-10 object-cover"
                  />
                  <span className="ml-2 text-white/80">{pin.discoveredByUserId.username}</span>
                </div>
              </Link>
            </div>
            {isCreator && (
              <div className="absolute top-4 right-4">
                <Button
                  onClick={handleDelete}
                  className="bg-red-500/20 border w-9 h-9 hover:bg-red-500 border-red-500 text-white p-2 rounded-full flex items-center justify-center"
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
