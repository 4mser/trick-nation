'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

const NucleusExplanation: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [isPaused, setIsPaused] = useState(false);
  const controls = useAnimation();
  const progressControls = useAnimation();
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
    startTimer(remainingTime, onComplete);
    progressControls.start({ width: '100%', transition: { duration: remainingTime / 1000, ease: 'linear' } });
  };

  useEffect(() => {
    startTimer(7000, onComplete);
    progressControls.start({ width: '100%', transition: { duration: 7, ease: 'linear' } });
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [onComplete, controls, progressControls]);

  return (
    <div
      className="w-full bg-neutral-950 text-white p-8 h-[90dvh] flex flex-col justify-center items-center select-none"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      style={{
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        userSelect: 'none',
      }}
    >
      <AnimatePresence>
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          <motion.h1 className="text-3xl font-bold mb-4">Ahora debes elegir tu núcleo</motion.h1>
          <motion.p className="mb-4 text-center max-w-2xl mx-auto">
            Los núcleos son grupos que te permiten colaborar con personas afines y participar en actividades que te apasionen.
          </motion.p>
          <motion.p className="mb-4 text-center max-w-2xl mx-auto">
            Al unirte a un núcleo, podrás participar en rankings, desafíos y eventos exclusivos que te permitirán ganar puntos y recompensas. ¡Elige sabiamente y contribuye al éxito de tu núcleo!
          </motion.p>
          <motion.div
            className="h-1 bg-yellow-500 rounded-full overflow-hidden mt-7"
            initial={{ width: 0 }}
            animate={progressControls}
            transition={{ duration: 7, ease: 'linear' }}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default NucleusExplanation;
