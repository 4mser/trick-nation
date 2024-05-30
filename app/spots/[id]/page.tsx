'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/services/api';
import { Spot } from '@/types/spots';
import { useAuth } from '@/context/auth-context';

const SpotDetails: React.FC = () => {
  const { user } = useAuth();
  const params = useParams();
  const { id } = params;
  const [spot, setSpot] = useState<Spot | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSpotDetails = async () => {
      try {
        const response = await api.get(`/spots/${id}`);
        setSpot(response.data);
      } catch (error) {
        console.error('Failed to fetch spot details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpotDetails();
  }, [id]);

  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this spot?');
    if (!confirmed) return;

    try {
      await api.delete(`/spots/${id}`);
      router.push('/');
    } catch (error) {
      console.error('Failed to delete spot:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!spot) {
    return <div>No spot data</div>;
  }

  const isCreator = user && spot.discoveredByUserId && user._id === spot.discoveredByUserId._id;

  return (
    <div className="text-white mb-16">
      {spot.imageUrl && <img src={`https://trick-nation-backend-production.up.railway.app${spot.imageUrl}`} alt={spot.name} className="w-full h-auto" />}
      <div className='p-4'>
        <h1 className="text-3xl font-bold">{spot.name}</h1>
        <p><strong>Discovered by:</strong> {spot.discoveredByUserId.username}</p>
        
        <p><strong>Created at:</strong> {new Date(spot.createdAt).toLocaleString()}</p>
        {isCreator && (
            <div className="mt-4">
            <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded"
            >
                Delete Spot
            </button>
            </div>
        )}
      </div>
      
    </div>
  );
};

export default SpotDetails;
