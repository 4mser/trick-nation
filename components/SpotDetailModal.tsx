import React from 'react';
import { Spot } from '../types/spots';

interface SpotDetailModalProps {
  spot: Spot | null;
  onClose: () => void;
}

const SpotDetailModal: React.FC<SpotDetailModalProps> = ({ spot, onClose }) => {
  if (!spot) return null;

  const handleModalClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation(); // Detiene la propagación del evento para que no cierre el modal
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div className="relative bg-black rounded-xl shadow-lg max-w-sm w-full overflow-hidden" onClick={handleModalClick}>
        <div className='relative'>
          <img
            src={`http://localhost:3000${spot.imageUrl || '/default-spot-image.jpg'}`}
            alt={spot.name}
            className="w-full h-40 object-cover mb-4"
          />
          <div className='absolute w-full bottom-0 h-20 bg-gradient-to-t from-black to-transparent'></div>
        </div>
        <div className='p-4'>
          <h3 className="text-xl font-bold mb-2">{spot.name}</h3>
          <p className="mb-2">{spot.discoveredByUserId.username}</p>
          <a href={`/spots/${spot._id}`} className="text-blue-500 hover:underline">View Details</a>
        </div>
      </div>
    </div>
  );
};

export default SpotDetailModal;
