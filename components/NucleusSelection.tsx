import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { motion } from 'framer-motion';

type NucleusSelectionProps = {
  onComplete: (nucleus: string) => void;
};

const nuclei = [
  {
    backendName: 'Enigma',
    name: 'Enigma',
    description: 'Rodeado de misterios y conocimientos ocultos, el Núcleo Enigma es un refugio para curiosos del mundo esotérico y paranormal. Es ideal para aquellos que buscan descubrir los secretos más profundos de la existencia, explorando enigmas que desafían la lógica.',
    bgColor: 'bg-gradient-to-br from-indigo-600/20 to-transparent border border-indigo-400/40',
    shadowColor: 'shadow-indigo-400/30',
    image: 'https://image.lexica.art/full_webp/eaa38ff4-ef57-470d-9070-18f6717cd2df',
    profiles: 'Sabio, Visionario, Aventurero, Guerrero',
    icon: '/assets/nucleos/enigma.svg'
  },
  {
    backendName: 'Quantum',
    name: 'Quantum',
    description: 'En el Núcleo Quantum, la ciencia y la tecnología son la base de todo. Es el hogar de aquellos que se apasionan por la innovación y el descubrimiento, explorando los misterios del universo y desarrollando soluciones que impulsan el futuro.',
    bgColor: 'bg-gradient-to-br from-cyan-600/20 to-transparent border border-cyan-700',
    shadowColor: 'shadow-cyan-700/30',
    image: 'https://image.lexica.art/full_webp/dd19b683-792e-4182-bf34-6ac9f688dbd5',
    profiles: 'Visionario, Creador, Guardián, Conector',
    icon: '/assets/nucleos/quantum.svg'
  },
  {
    backendName: 'Arboreo',
    name: 'Arbóreo',
    description: 'Enraizado en el amor y el respeto por la naturaleza, el Núcleo Arbóreo valora la conservación del medio ambiente y la biodiversidad. Sus miembros se esfuerzan por vivir en armonía con el planeta, promoviendo un futuro sostenible para todas las formas de vida.',
    bgColor: 'bg-gradient-to-br from-lime-600/20 to-transparent border border-lime-700',
    shadowColor: 'shadow-lime-700/30',
    image: 'https://image.lexica.art/full_webp/15a3113e-bc6b-439c-8c2b-31fde388f29c',
    profiles: 'Guardián, Aventurero, Sabio',
    icon: '/assets/nucleos/arboreo.svg'
  },
  {
    backendName: 'Aureo',
    name: 'Áureo',
    description: 'Un santuario de la creatividad, la expresión y la disciplina. El Núcleo Áureo celebra las artes en todas sus manifestaciones. Desde la pintura hasta la música y el deporte, es un lugar para aquellos que sueñan con superarse si mismos e inspirar a el mundo.',
    bgColor: 'bg-gradient-to-br from-yellow-600/20 to-transparent border border-yellow-700',
    shadowColor: 'shadow-yellow-700/30',
    image: 'https://image.lexica.art/full_webp/fe7c5a9a-7430-4420-a877-b8ff1147e20b',
    profiles: 'Creador, Guerrero, Conector, Visionario',
    icon: '/assets/nucleos/aureo.svg'
  },
];

const NucleusSelection: React.FC<NucleusSelectionProps> = ({ onComplete }) => {
  const [selectedNucleus, setSelectedNucleus] = useState<string | null>(null);

  const handleNucleusSelect = (nucleus: string) => {
    setSelectedNucleus(nucleus);
  };

  return (
    <div className="fixed w-full h-full z-20 top-0 left-0 bg-neutral-950 overflow-y-auto pb-10">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="fixed w-full z-10 px-6 py-3 top-0 left-0 text-md text-white bg-neutral-950 text-center flex justify-between items-center"
      >
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
      </motion.div>
      <div className="pt-20">
        <Swiper
          pagination={{ clickable: true }}
          modules={[Pagination]}
          className="w-full h-full mySwiper"
          slidesPerView={1.1}
          spaceBetween={20}
          centeredSlides={true}
        >
          {nuclei.map((nucleus, index) => (
            <SwiperSlide key={nucleus.name} className="pb-12 pt-2">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.004, ease: 'easeInOut' }}
                className={`relative ${nucleus.bgColor} text-white  shadow-lg h-[33rem] cursor-pointer p-6 rounded-lg transition-all duration-500 ${
                  selectedNucleus === nucleus.backendName ? `${nucleus.shadowColor} shadow-xl` : 'shadow'
                }`}
                onClick={() => handleNucleusSelect(nucleus.backendName)}
              >
                <div className="absolute top-4 left-4">
                  <div
                    className={`w-8 h-8 rounded-full border-[3px] transition-all duration-500 ${
                      selectedNucleus === nucleus.backendName ? 'bg-yellow-500/80 border-yellow-500 shadow-xl shadow-yellow-500/70' : 'border-white bg-white/30'
                    }`}
                  ></div>
                </div>
                <img src={nucleus.image} alt={`${nucleus.name} icon`} className="w-full h-64 object-cover rounded-lg mb-4" />
                <div className="flex flex-col space-y-2 flex-grow">
                  <div className='w-fit flex gap-2 justify-between'>
                    <img src={nucleus.icon} alt="enimga icon" width={26} height={26} className='rounded-full' />
                    <h3 className="text-2xl">{nucleus.name}</h3>
                  </div>
                  <p className="text-sm font-light opacity-90">{nucleus.description}</p>
                  <p className="text-xs italic opacity-70 absolute bottom-6">Roles Recomendados: {nucleus.profiles}</p>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default NucleusSelection;
