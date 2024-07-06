import React, { useState, useEffect } from 'react';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import CustomSwitch from './CustomSwitch'; // Importa el switch personalizado

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
  { name: 'Historia y Patrimonio', icon: '/assets/categories/historia.svg' }
];

interface TotemFilterDrawerProps {
  onApplyFilters: (selectedCategories: string[]) => void;
}

const TotemFilterDrawer: React.FC<TotemFilterDrawerProps> = ({ onApplyFilters }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(categoriesList.map(category => category.name));

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prevCategories =>
      prevCategories.includes(category)
        ? prevCategories.filter(c => c !== category)
        : [...prevCategories, category]
    );
  };

  useEffect(() => {
    onApplyFilters(selectedCategories); // Apply filters on initial render with all categories selected
  }, []); // Empty dependency array to run only once on mount

  useEffect(() => {
    if (!drawerOpen) {
      onApplyFilters(selectedCategories); // Apply filters when drawer is closed
    }
  }, [drawerOpen, selectedCategories, onApplyFilters]);

  return (
    <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
      <DrawerTrigger asChild>
        <Button className='absolute right-3 top-4 w-14 h-14 rounded-full overflow-hidden flex justify-center items-center bg-gradient-to-tr from-green-500 to-blue-400 p-[2px] outline-none'>
          <div className='flex justify-center items-center w-full h-full p-1  bg-black/30 backdrop-blur-3xl rounded-full'>
            <img src="/assets/categories/todo.svg" alt="Filter Totems" className='w-full h-full object-cover' />
          </div>
        </Button>
      </DrawerTrigger>
      <DrawerContent className=" bg-white/5 border-none backdrop-blur-md rounded-t-3xl outline-none">
        <DrawerHeader>
          <DrawerTitle className="text-white text-center">Categorías</DrawerTitle>
        </DrawerHeader>
        <DrawerDescription asChild>
          <div>
            <form className="text-sm mb-6">
              <div className="px-3 flex flex-col gap-4">
                {categoriesList.map((category) => {
                  const isSelected = selectedCategories.includes(category.name);
                  return (
                    <div key={category.name} className="flex items-center  custom-switch justify-between">
                      <div className='flex items-center'>
                        <img src={category.icon} alt={category.name} className={`h-6 w-6 mr-2 ${isSelected ? 'category-selected' : 'category-not-selected'}`} />
                        <label className={`text-white/80 ${isSelected ? 'category-selected' : 'category-not-selected'}`}>{category.name}</label>
                      </div>
                      <CustomSwitch
                        checked={isSelected}
                        onChange={() => handleCategoryChange(category.name)}
                      />
                    </div>
                  );
                })}
              </div>
                <DrawerClose asChild>
                </DrawerClose>
            </form>
          </div>
        </DrawerDescription>
      </DrawerContent>
    </Drawer>
  );
};

export default TotemFilterDrawer;
