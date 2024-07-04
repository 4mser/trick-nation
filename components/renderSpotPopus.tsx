import React from 'react';
import { Spot } from '../types/pins';

interface SpotPopupProps {
  spot: Spot;
}

const SpotPopup: React.FC<SpotPopupProps> = ({ spot }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md max-w-xs">
      <h3 className="text-xl font-bold mb-2">{spot.name}</h3>
      <p className="mb-2"><strong>Discovered by:</strong> {spot.discoveredByUserId.username}</p>
      <a href={`/spots/${spot._id}`} className="text-blue-500 hover:underline">View Details</a>
    </div>
  );
};

export default SpotPopup;
