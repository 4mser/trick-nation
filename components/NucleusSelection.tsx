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
    backendName:'Enigma',
    description: 'Rodeado de misterios y conocimientos ocultos, el Núcleo Enigma es un refugio para los curiosos del mundo esotérico y paranormal. Es ideal para aquellos que buscan descubrir los secretos más profundos de la existencia, explorando enigmas que desafían la lógica.',
    bgColor: 'bg-gradient-to-br from-indigo-600/20 to-transparent border border-indigo-400/40',
    image: '/images/enigma.jpeg',
    profiles: 'Sabio, Visionario, Aventurero'
  },
  {
    name: 'Quantum',
    backendName:'Quantum',
    description: 'Inspirado en la frontera de la ciencia y la tecnología, el Núcleo Quantum se dedica a la innovación y al descubrimiento científico. Es el hogar de pioneros comprometidos con los misterios de la realidad y el avance de la humanidad mediante la tecnología moderna.',
    bgColor: 'bg-gradient-to-br from-cyan-600/20 to-transparent border border-cyan-700',
    image: '/images/quantum.jpeg',
    profiles: 'Creador, Guardián, Conector'
  },
  {
    name: 'Arbóreo',
    backendName:'Arboreo',
    description: 'Enraizada en el amor y el respeto por la naturaleza, el Núcleo Arbóreo valora la conservación del medio ambiente y la biodiversidad. Sus miembros se esfuerzan por vivir en armonía con el planeta, promoviendo un futuro sostenible para todas las formas de vida.',
    bgColor: 'bg-gradient-to-br from-lime-600/20 to-transparent border border-lime-700',
    image: '/images/arboreo.jpeg',
    profiles: 'Guardián, Aventurero, Sabio'
  },
  {
    name: 'Áureo',
    backendName:'Aureo',
    description: 'Un santuario de la creatividad y la expresión, el Núcleo Áureo celebra las artes en todas sus manifestaciones. Desde la pintura hasta la música y el diseño, es un lugar para aquellos que sueñan con inspirar al mundo a través de su arte y creatividad única.',
    bgColor: 'bg-gradient-to-br from-yellow-600/20 to-transparent border border-yellow-700',
    image: '/images/aureo.jpeg',
    profiles: 'Creador, Conector, Visionario'
  },
];

const NucleusSelection: React.FC<NucleusSelectionProps> = ({ onComplete }) => {
  const [selectedNucleus, setSelectedNucleus] = useState<string | null>(null);

  const handleNucleusSelect = (nucleus: string) => {
    setSelectedNucleus(nucleus);
  };

  return (
    <div className="fixed w-full h-full z-20 top-0 left-0 bg-neutral-950 overflow-y-auto pb-10">
      <div className="fixed  w-full z-10 px-6 py-3 top-0 left-0 text-md text-white bg-neutral-950 text-center flex justify-between items-center">
        <span>Selecciona tu núcleo</span>
        <button
          onClick={() => onComplete(selectedNucleus!)}
          disabled={!selectedNucleus}
          className={`border border-white bg-neutral-950 text-white py-2 px-4 rounded transition duration-300 ease-in-out ${
            selectedNucleus ? 'hover:scale-95' : 'opacity-50 cursor-not-allowed'
          }`}
        >
          Continuar
        </button>
      </div>
      <div className="pt-20">
        <Swiper
          pagination={{ clickable: true }}
          modules={[Pagination]}
          className="w-full h-full mySwiper"
          slidesPerView={1.1}
          spaceBetween={20}
          centeredSlides={true}
        >
          {nuclei.map((nucleus) => (
            <SwiperSlide key={nucleus.name} className="pb-12">
              <div
                className={`relative ${nucleus.bgColor} text-white shadow-lg h-full cursor-pointer  p-6 rounded-lg`}
                onClick={() => handleNucleusSelect(nucleus.backendName)}
              >
                <div className="absolute top-4 left-4">
                  <div
                    className={`w-8 h-8 rounded-full border-[3px] ${
                      selectedNucleus === nucleus.backendName ? 'bg-yellow-500/80 border-yellow-500 shadow-xl shadow-yellow-500/70' : 'border-white bg-white/30'
                    }`}
                  ></div>
                </div>
                <img src={nucleus.image} alt={`${nucleus.name} icon`} className="w-full h-64 object-cover rounded-lg mb-4" />
                <div className="flex flex-col space-y-2 flex-grow">
                  <h3 className="text-2xl">{nucleus.name}</h3>
                  <p className="text-sm font-light opacity-90">{nucleus.description}</p>
                  <p className="text-xs italic opacity-70">Roles Recomendados: {nucleus.profiles}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default NucleusSelection;
