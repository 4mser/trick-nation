import React from 'react';
import { Pin } from '../types/pins';

interface PinDetailModalProps {
  pin: Pin | null;
  onClose: () => void;
}

const PinDetailModal: React.FC<PinDetailModalProps> = ({ pin, onClose }) => {
  if (!pin) return null;

  const handleModalClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation(); // Detiene la propagación del evento para que no cierre el modal
  };

  return (
    <div className="fixed inset-0 z-[100] flex text-white items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
      <div className="relative bg-white/10 backdrop-blur-md rounded-xl shadow-lg max-w-sm w-full overflow-hidden" onClick={handleModalClick}>
        <div className='relative'>
          <img
            src={`${pin.imageUrl || '/default-pin-image.jpg'}`}
            alt={pin.name}
            className="w-full h-full object-cover mb-4"
          />
        </div>
        <div className='p-4'>
          <h3 className="text-xl font-bold mb-2">{pin.name}</h3>
          <p className="mb-2">{pin.discoveredByUserId.username}</p>
          <a href={`/spots/${pin._id}`} className="text-blue-500 hover:underline">View Details</a>
        </div>
      </div>
    </div>
  );
};

export default PinDetailModal;
