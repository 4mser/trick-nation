import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';

type NucleusSelectionProps = {
  onComplete: (nucleus: string) => void;
};

const nuclei = [
  {
    name: 'Enigma',
    description: 'Rodeado de misterios y conocimientos ocultos, el Núcleo Enigma es un refugio para los curiosos del mundo esotérico y paranormal. Es ideal para aquellos que buscan descubrir los secretos más profundos de la existencia.',
    bgColor: 'bg-gradient-to-br from-indigo-950 to-neutral-950',
    image: '/images/enigma.jpeg',
    profiles: 'Sabio, Visionario, Aventurero'
  },
  {
    name: 'Quantum',
    description: 'Inspirado en la frontera de la ciencia y la tecnología, el Núcleo Quantum se dedica a la innovación y al descubrimiento científico. Es el hogar de los pioneros del mañana, aquellos comprometidos con los misterios de la realidad y el avance de la humanidad a través de la ciencia y tecnología.',
    bgColor: 'bg-gradient-to-br from-cyan-700 to-cyan-950',
    image: '/images/quantum.jpeg',
    profiles: 'Creador, Guardián, Conector'
  },
  {
    name: 'Arbóreo',
    description: 'Enraizada en el amor y el respeto por la naturaleza, el Núcleo Arbóreo valora la conservación del medio ambiente y la biodiversidad. Sus miembros se esfuerzan por vivir en armonía con el planeta, promoviendo un futuro sostenible para todas las formas de vida.',
    bgColor: 'bg-gradient-to-br from-lime-800 to-lime-950',
    image: '/images/arboreo.jpeg',
    profiles: 'Guardián, Aventurero, Sabio'
  },
  {
    name: 'Áureo',
    description: 'Un santuario de la creatividad y la expresión, el Núcleo Áureo celebra las artes en todas sus manifestaciones. Desde la pintura y la música hasta la escritura y el diseño, es un lugar para los que sueñan con inspirar al mundo a través de su arte.',
    bgColor: 'bg-gradient-to-br from-yellow-600 to-orange-950',
    image: '/images/aureo.jpeg',
    profiles: 'Creador, Conector, Visionario'
  },
];

const NucleusSelection: React.FC<NucleusSelectionProps> = ({ onComplete }) => {
  const handleNucleusSelect = (nucleus: string) => {
    onComplete(nucleus);
  };

  return (
    <div className="">
      <h2 className="fixed w-full bg-neutral-950 z-10 px-6 py-3 top-0 left-0 text-xl text-white ">Selecciona tu núcleo</h2>
      <Swiper
        pagination={{ clickable: true }}
        modules={[Pagination]}
        className="w-full h-[100dvh] overflow-hidden"
        slidesPerView={1.2}
        spaceBetween={20}
      >
        {nuclei.map((nucleus) => (
          <SwiperSlide key={nucleus.name} className="flex justify-center  items-center h-[100dvh]">
            <div
              className={`relative ${nucleus.bgColor} text-white shadow-lg cursor-pointer space-y-3 w-full h-[100dvh] flex flex-col justify-between p-6 pb-32 pt-20 overflow-y-auto`}
            >
              <img src={nucleus.image} alt={`${nucleus.name} icon`} className="w-full object-contain rounded-lg" />
              <div className="flex flex-col flex-grow space-y-2">
                <h3 className="text-xl">{nucleus.name}</h3>
                <p className="text-sm font-normal opacity-90">{nucleus.description}</p>
                <p className="text-xs italic opacity-70">Roles Recomendados: {nucleus.profiles}</p>
              </div>
              <div className="">
                <button
                  onClick={() => handleNucleusSelect(nucleus.name)}
                  className="border text-white font-bold py-2 px-4 rounded"
                >
                  Seleccionar Núcleo
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default NucleusSelection;
