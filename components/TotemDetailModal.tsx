import React from 'react';
import { Totem } from '@/types/totem';

interface TotemDetailModalProps {
  totem: Totem | null;
  onClose: () => void;
}

const TotemDetailModal: React.FC<TotemDetailModalProps> = ({ totem, onClose }) => {
  if (!totem) return null;

  const handleModalClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation(); // Detiene la propagación del evento para que no cierre el modal
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
        </div>
      </div>
    </div>
  );
};

export default TotemDetailModal;
