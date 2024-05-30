import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-cards';
import { EffectCards } from 'swiper/modules';
import api from '../services/api';
import { Trick } from '../types/tricks';

const TrickList: React.FC = () => {
  const [tricks, setTricks] = useState<Trick[]>([]);

  useEffect(() => {
    const fetchTricks = async () => {
      try {
        const response = await api.get<Trick[]>('/tricks');
        setTricks(response.data);
      } catch (error) {
        console.error('Failed to fetch tricks:', error);
      }
    };

    fetchTricks();
  }, []);

  const groupedTricks = tricks.reduce((acc, trick) => {
    if (!acc[trick.type]) {
      acc[trick.type] = [];
    }
    acc[trick.type].push(trick);
    return acc;
  }, {} as { [key: string]: Trick[] });

  return (
    <div className="space-y-8 p-4 mb-20">
      {Object.keys(groupedTricks).map((type) => (
        <div key={type}>
          <h2 className="text-3xl font-bold text-white mb-4">{type}</h2>
          <Swiper
            effect={'cards'}
            grabCursor={true}
            modules={[EffectCards]}
            className="mySwiper"
            style={{ maxWidth: '100%' }}
          >
            {groupedTricks[type].map((trick) => (
              <SwiperSlide key={trick._id} style={{ display: 'flex', justifyContent: 'center' }}>
                <div className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105 w-64">
                  <h3 className="text-xl font-semibold mb-2">{trick.name}</h3>
                  <p className="text-md mb-2">{trick.type}</p>
                  <button className="bg-blue-500 text-white py-1 px-3 rounded-full hover:bg-blue-700 transition duration-300">Unlock</button>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ))}
    </div>
  );
};

export default TrickList;
