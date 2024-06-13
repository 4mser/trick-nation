'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

const roles = [
  {
    name: 'Sabio',
    description: 'Buscadores de conocimiento y verdad, los Sabios se dedican al estudio y la comprensión del mundo.',
  },
  {
    name: 'Aventurero',
    description: 'Exploradores intrépidos que siempre buscan nuevas experiencias y desafíos.',
  },
  {
    name: 'Conector',
    description: 'Expertos en crear redes y unir a las personas, los Conectores son el pegamento social.',
  },
  {
    name: 'Creador',
    description: 'Innovadores y artistas que disfrutan creando cosas nuevas y expresando su creatividad.',
  },
  {
    name: 'Guardián',
    description: 'Protectores y cuidadores que valoran la seguridad y el bienestar de los demás.',
  },
  {
    name: 'Visionario',
    description: 'Pensadores futuristas que sueñan con un mundo mejor y trabajan para hacerlo realidad.',
  },
  {
    name: 'Guerrero',
    description: 'Defensores valientes y fuertes, siempre dispuestos a luchar por lo que es justo.',
  },
];

const RolesExplanation: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const controls = useAnimation();
  const progressControls = useAnimation();
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const elapsedTimeRef = useRef<number>(0);
  const totalDurationRef = useRef<number>(7000);

  const startTimer = (duration: number, callback: () => void) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    startTimeRef.current = Date.now();
    timerRef.current = setTimeout(callback, duration);
  };

  const handleMouseDown = () => {
    setIsPaused(true);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    controls.stop();
    progressControls.stop();
    elapsedTimeRef.current += Date.now() - startTimeRef.current;
  };

  const handleMouseUp = () => {
    setIsPaused(false);
    const remainingTime = totalDurationRef.current - elapsedTimeRef.current;
    if (currentStep === 0) {
      startTimer(remainingTime, () => setCurrentStep(1));
      progressControls.start({ width: '100%', transition: { duration: remainingTime / 1000, ease: 'linear' } });
    } else if (currentStep === 1) {
      startTimer(remainingTime, onComplete);
      controls.start({
        y: '-100%',
        transition: { duration: remainingTime / 1000, ease: 'linear' },
      });
      progressControls.start({
        width: '100%',
        transition: { duration: remainingTime / 1000, ease: 'linear' },
      });
    }
  };

  useEffect(() => {
    if (currentStep === 0) {
      totalDurationRef.current = 7000;
      startTimer(7000, () => setCurrentStep(1));
      progressControls.start({ width: '100%', transition: { duration: 7, ease: 'linear' } });
    } else if (currentStep === 1) {
      totalDurationRef.current = roles.length * 2500;
      startTimer(roles.length * 2500, onComplete);
      controls.start({ y: '-100%', transition: { duration: roles.length * 2.5, ease: 'linear' } });
      progressControls.start({ width: '100%', transition: { duration: roles.length * 2.5, ease: 'linear' } });
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [currentStep, onComplete, controls, progressControls]);

  return (
    <div
      className="w-full bg-neutral-950 text-white p-8 h-[100dvh] overflow-hidden flex flex-col justify-center items-center select-none"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
    >
      <AnimatePresence>
        {currentStep === 0 && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <motion.h1 className="text-3xl font-bold mb-4">¿Por qué usamos roles?</motion.h1>
            <motion.p className="mb-4 text-center max-w-2xl mx-auto">
              Los roles nos ayudan a identificar nuestras fortalezas y áreas de interés. Al conocer tu rol, podrás enfocarte en actividades que te resulten más gratificantes y alineadas con tu personalidad.
            </motion.p>
            <motion.div
              className="h-1 bg-yellow-500 rounded-full overflow-hidden mt-7"
              initial={{ width: 0 }}
              animate={progressControls}
              transition={{ duration: 7, ease: 'linear' }}
            />
          </motion.div>
        )}

        {currentStep === 1 && (
          <motion.div
            key="roles"
            className="w-full text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <motion.h1 className="text-2xl font-bold mb-4 absolute top-0 left-0 py-4 bg-neutral-950 text-center w-full z-10">Presentación de Roles</motion.h1>
            <motion.div
              className="flex flex-col items-center"
              initial={{ y: '100%' }}
              animate={controls}
              transition={{ duration: roles.length * 2.5, ease: 'linear' }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              {roles.map((role) => (
                <div
                  key={role.name}
                  className="p-6 bg-gradient-to-br from-yellow-500/20 to-transparent border border-yellow-500 rounded-lg shadow-md mb-4 w-80"
                  style={{ flex: 'none' }}
                >
                  <h2 className="text-xl font-bold mb-2">{role.name}</h2>
                  <p className="text-sm opacity-80">{role.description}</p>
                </div>
              ))}
            </motion.div>
            <div className='w-full absolute py-3 top-12 z-10 left-0 bg-neutral-950 flex px-5 items-center shadow-lg'>
              <motion.div
                className="h-1 bg-yellow-500 rounded-full overflow-hidden"
                initial={{ width: 0 }}
                animate={progressControls}
                transition={{ duration: roles.length * 2.5, ease: 'linear' }}
              />
            </div>
            <button
              onClick={onComplete}
              className="bg-gradient-to-br from-yellow-500/20 to-transparent border border-yellow-500 hover:scale-105 transition-transform text-white py-3 px-6 rounded-lg font-semibold focus:outline-none focus:shadow-outline mt-6"
            >
              Ir al Test
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RolesExplanation;
