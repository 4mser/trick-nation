'use client';

import React, { useEffect, useState } from 'react';
import { Pin } from '../types/pins';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface PinDetailDrawerProps {
  pin: Pin | null;
  onClose: () => void;
}

const PinDetailModal: React.FC<PinDetailDrawerProps> = ({ pin, onClose }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

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

  if (!pin) return null;

  return (
    <Drawer open={drawerOpen} onOpenChange={handleDrawerClose}>
      <DrawerContent className="dark backdrop-blur-md rounded-t-3xl">
        <DrawerHeader>
          <DrawerTitle className="text-white text-center">{pin.name}</DrawerTitle>
          <DrawerDescription className=''>
            <p className="mb-2">{pin.discoveredByUserId.username}</p>
            <div className="relative w-full">
              <img
                src={`${pin.imageUrl || '/default-pin-image.jpg'}`}
                alt={pin.name}
                className="w-full max-h-[70dvh] rounded-md object-cover"
              />
            </div>
          </DrawerDescription>
        </DrawerHeader>
        <DrawerClose></DrawerClose>
      </DrawerContent>
    </Drawer>
  );
};

export default PinDetailModal;
