'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/services/api';
import { Pin } from '@/types/pins';
import { useAuth } from '@/context/auth-context';
import Loader from '@/components/Loader';

const SpotDetails: React.FC = () => {
  const { user } = useAuth();
  const params = useParams();
  const { id } = params;
  const [pin, setSpot] = useState<Pin | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSpotDetails = async () => {
      try {
        const response = await api.get(`/pins/${id}`);
        setSpot(response.data);
      } catch (error) {
        console.error('Failed to fetch pin details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpotDetails();
  }, [id]);

  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this pin?');
    if (!confirmed) return;

    try {
      await api.delete(`/pins/${id}`);
      router.push('/');
    } catch (error) {
      console.error('Failed to delete pin:', error);
    }
  };

  if (loading) {
    return <div className='w-full h-[100dvh] grid place-items-center'><Loader /></div>;
  }

  if (!pin) {
    return <div>No pin data</div>;
  }

  const isCreator = user && pin.discoveredByUserId && user._id === pin.discoveredByUserId._id;

  return (
    <div className="text-white mb-16">
      {pin.imageUrl && <img src={`${pin.imageUrl}`} alt={pin.name} className="w-full h-auto" />}
      <div className='p-4'>
        <h1 className="text-3xl font-bold">{pin.name}</h1>
        <p><strong>Publicado por:</strong> {pin.discoveredByUserId.username}</p>
        
        <p>{new Date(pin.createdAt).toLocaleString()}</p>
        {isCreator && (
            <div className="mt-4">
            <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded"
            >
                Eliminar Pin
            </button>
            </div>
        )}
      </div>
      
    </div>
  );
};

export default SpotDetails;
