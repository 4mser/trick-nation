import React, { useEffect, useState } from 'react';
import { Totem } from '@/types/totem';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

interface TotemDetailModalProps {
  totem: Totem | null;
  onClose: () => void;
}

const categoriesList = [
  { name: 'Naturaleza', icon: '/assets/categories/naturaleza.svg' },
  { name: 'Rutas y Aventuras', icon: '/assets/categories/rutas.svg' },
  { name: 'Comidas y Bebidas', icon: '/assets/categories/comidas.svg' },
  { name: 'Deporte y Fitness', icon: '/assets/categories/deporte.svg' },
  { name: 'Actividades y Eventos', icon: '/assets/categories/eventos.svg' },
  { name: 'Educación y Cultura', icon: '/assets/categories/cultura.svg' },
  { name: 'Activismo y Medioambiente', icon: '/assets/categories/medioambiente.svg' },
  { name: 'Ciencia y Tecnología', icon: '/assets/categories/ciencia.svg' },
  { name: 'Emprendimientos', icon: '/assets/categories/emprendimientos.svg' },
  { name: 'Exploración Urbana', icon: '/assets/categories/exploracion.svg' },
  { name: 'Arte y Creatividad', icon: '/assets/categories/arte.svg' },
  { name: 'Salud y Bienestar', icon: '/assets/categories/salud.svg' },
  { name: 'Belleza y Estilo', icon: '/assets/categories/belleza.svg' },
  { name: 'Historia y Patrimonio', icon: '/assets/categories/historia.svg' },
];

const TotemDetailModal: React.FC<TotemDetailModalProps> = ({ totem, onClose }) => {
  if (!totem) return null;

  const handleModalClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation(); // Detiene la propagación del evento para que no cierre el modal
  };

  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (totem) {
      setDrawerOpen(true);
    } else {
      setDrawerOpen(false);
    }
  }, [totem]);

  const handleDrawerClose = (isOpen: boolean) => {
    if (!isOpen) {
      setDrawerOpen(false);
      setTimeout(onClose, 300); // Delay onClose to allow for smooth transition
    }
  };

  const renderCategories = () => {
    return (totem.categories || []).map((category) => {
      const categoryData = categoriesList.find(c => c.name === category);
      if (categoryData) {
        return (
          <div key={category} className="flex justify-center items-center space-x-2 p-2 bg-neutral-800 rounded-full">
            <img src={categoryData.icon} alt={categoryData.name} className="h-7 w-7" />
          </div>
        );
      }
      return null;
    });
  };

  return (
    <Drawer open={drawerOpen} onOpenChange={handleDrawerClose}>
      <DrawerContent className='dark rounded-t-3xl outline-none'>
        <DrawerTitle>

        </DrawerTitle>
        <DrawerDescription>
        <div className='p-4'>
          <img
            src={totem.imageUrl}
            alt={totem.name}
            className="w-full max-h-[65dvh] object-cover rounded-md"
          />
        </div>
        <section className='p-4'>
          <div className='flex justify-between w-full items-center'>
            <h1 className="text-xl font-bold mb-2 text-white">{totem.name}</h1>
            <a href={`/totems/${totem._id}`} className="text-yellow-500 hover:underline">Entrar al Totem</a>
          </div>
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              {renderCategories()}
            </div>
          </div>
        </section>
        </DrawerDescription>
        <DrawerClose></DrawerClose>
      </DrawerContent>
    </Drawer>
  );
};

export default TotemDetailModal;
