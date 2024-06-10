'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import OnboardingModal from '@/components/OnboardingModal';
import api from '@/services/api';
import { User } from '@/types/user';
import Loader from '@/components/Loader';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import Link from 'next/link';

const categorias = [
  {
      id: 1,
      name: 'Naturaleza',
      icon: '/assets/categories/naturaleza.svg',
      description: 'Descubre y conserva la biodiversidad local.'
  },
  {
      id: 2,
      name: 'Rutas y Aventuras',
      icon: '/assets/categories/rutas.svg',
      description: 'Embárcate en misiones emocionantes.'
  },
  {
      id: 3,
      name: 'Comidas y Bebidas',
      icon: '/assets/categories/comidas.svg',
      description: 'Explora la gastronomía local y gana recompensas.'
  },
  {
      id: 4,
      name: 'Deporte y Fitness',
      icon: '/assets/categories/deporte.svg',
      description: 'Mantente activo y gana tokens por tus logros.'
  },
  {
      id: 5,
      name: 'Actividades y Eventos',
      icon: '/assets/categories/eventos.svg',
      description: 'Participa en eventos culturales y sociales.'
  },
  {
      id: 6,
      name: 'Educación y Cultura',
      icon: '/assets/categories/cultura.svg',
      description: 'Enriquece tu conocimiento y cultura personal.'
  },
  {
      id: 7,
      name: 'Activismo y Medioambiente',
      icon: '/assets/categories/medioambiente.svg',
      description: 'Contribuye a un planeta más verde.'
  },
  {
      id: 8,
      name: 'Ciencia y Tecnología',
      icon: '/assets/categories/ciencia.svg',
      description: 'Explora y participa en la innovación científica.'
  },
  {
      id: 9,
      name: 'Emprendimientos',
      icon: '/assets/categories/emprendimientos.svg',
      description: 'Descubre y apoya startups innovadoras.'
  },
  {
      id: 10,
      name: 'Exploración Urbana',
      icon: '/assets/categories/exploracion.svg',
      description: 'Descubre secretos y maravillas de tu ciudad.'
  },
  {
      id: 11,
      name: 'Arte y Creatividad',
      icon: '/assets/categories/arte.svg',
      description: 'Sumérgete en el mundo del arte y la creatividad.'
  },
  {
      id: 12,
      name: 'Salud y Bienestar',
      icon: '/assets/categories/salud.svg',
      description: 'Participa en actividades que fomenten una vida saludable.'
  },
  {
      id: 13,
      name: 'Belleza y Estilo',
      icon: '/assets/categories/belleza.svg',
      description: 'Explora las últimas tendencias de moda y estilo.'
  },
  {
      id: 14,
      name: 'Historia y Patrimonio',
      icon: '/assets/categories/historia.svg',
      description: 'Explora sitios históricos y patrimoniales.'
  }
];

const Home: React.FC = () => {
  const { user } = useAuth();
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (user) {
        try {
          const response = await api.get(`/users/${user._id}`);
          const userData: User = response.data;
          setShowOnboardingModal(!userData.onboardingCompleted);
        } catch (error) {
          console.error('Error checking onboarding status:', error);
        }
      }
      setLoading(false);
    };

    checkOnboardingStatus();
  }, [user]);

  const handleComplete = () => {
    setShowOnboardingModal(false);
    window.location.href = '/onboarding';
  };

  const handleSkip = () => {
    setShowOnboardingModal(false);
  };

  if (loading) {
    return (
      <div className="w-full h-[95dvh] grid place-items-center text-yellow-500">
        <Loader />
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="bg-neutral-950 text-white h-[100dvh]">
        <header className="fixed left-0 top-0 w-full bg-neutral-950 border-b border-white/10 text-yellow-500 py-5">
          <div className="max-w-screen-xl mx-auto flex justify-between items-center px-5">
            <img
              src="/images/tipografiaXplorers.png"
              alt="Xplorers Logo"
              className="w-[130px] h-auto"
            />
            <nav>
              {user && (
                <Link href="/profile">
                  <img
                    src={user.profilePictureUrl || '/profile.jpeg'}
                    alt="Profile Picture"
                    className="w-8 h-8 object-cover rounded-full"
                  />
                </Link>
              )}
            </nav>
          </div>
        </header>
        <main className="max-w-screen-xl mx-auto  px-5 mt-24">
            <p className="text-lg">
              Cada paso abre la puerta a un tesoro oculto. Explora tu ciudad, descubre historias y gana recompensas por cada actividad cotidiana.
            </p>
          <section className="mt-10">
            <h2 className="text-2xl font-bold mb-6">Categorías Principales</h2>
            <Swiper
              pagination={{ clickable: true }}
              modules={[Pagination]}
              className="w-full mySwiper"
              slidesPerView={1.5}
              spaceBetween={10}
              centeredSlides={true}
            >
              {categorias.map(categoria => (
                <SwiperSlide key={categoria.id} className="flex flex-col items-center pb-12 pt-8">
                  <div className="bg-neutral-900 p-5 rounded-lg shadow-lg text-center w-full">
                    <img src={categoria.icon} alt={categoria.name} className="w-16 h-16 mx-auto mb-4" />
                    <h4 className="text-2xl font-bold mb-2">{categoria.name}</h4>
                    <p>{categoria.description}</p>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </section>
        </main>
        {showOnboardingModal && user && (
          <OnboardingModal
            user={user}
            onComplete={handleComplete}
            onSkip={handleSkip}
          />
        )}
      </div>
    </ProtectedRoute>
  );
};

export default Home;
