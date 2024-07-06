import React from 'react';
import { Totem } from '@/types/totem';

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

  const renderCategories = () => {
    return (totem.categories || []).map((category) => {
      const categoryData = categoriesList.find(c => c.name === category);
      if (categoryData) {
        return (
          <div key={category} className="flex items-center space-x-2 p-1 bg-neutral-800 rounded-full">
            <img src={categoryData.icon} alt={categoryData.name} className="h-6 w-6" />
            <span className="text-sm">{categoryData.name}</span>
          </div>
        );
      }
      return null;
    });
  };

  return (
    <div className="fixed inset-0 text-white flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div className="relative bg-black rounded-xl shadow-lg max-w-sm w-full overflow-hidden" onClick={handleModalClick}>
        <div className='relative'>
          <img
            src={totem.imageUrl}
            alt={totem.name}
            className="w-full h-40 object-cover mb-4"
          />
          <div className='absolute w-full bottom-0 h-20 bg-gradient-to-t from-black to-transparent'></div>
        </div>
        <div className='p-4'>
          <h3 className="text-xl font-bold mb-2">{totem.name}</h3>
          <a href={`/totems/${totem._id}`} className="text-blue-500 hover:underline">Entrar al Totem</a>
          <div className="mt-4">
            <h4 className="text-lg font-semibold mb-2">Categories</h4>
            <div className="flex flex-wrap gap-2">
              {renderCategories()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotemDetailModal;
