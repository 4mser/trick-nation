import React, { useEffect, useState } from 'react';
import { User } from '@/types/user';
import { motion, AnimatePresence } from 'framer-motion';

interface OnboardingModalProps {
  user: User;
  onComplete: () => void;
  onSkip: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ user, onComplete, onSkip }) => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowModal(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (user.onboardingCompleted) {
    return null;
  }

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          className="fixed top-0 left-0 z-20 inset-0 flex items-center justify-center bg-neutral-950 bg-opacity-90 px-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onSkip}
        >
          <motion.div
            className="relative text-white p-8 rounded-lg shadow-lg w-full max-w-md bg-gradient-to-br from-neutral-800 to-transparent"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4 text-yellow-500">Completa tu perfil</h2>
            <p className="mb-4 text-sm">Realiza el test psicologico y elige tu núcleo para obtener una experiencia personalizada.</p>
            <div className="flex justify-end space-x-3">
              <div className="relative">
                <button
                  onClick={onComplete}
                  className="bg-yellow-500 hover:bg-neutral-900 border border-yellow-500  text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out text-xs relative z-10"
                >
                  Continuar
                </button>
                <div className="absolute inset-0 w-full h-full flex justify-center items-center">
                  <div className="w-16 h-16 bg-yellow-500 rounded-full blur-2xl opacity-50 animate-ping pointer-events-none"></div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OnboardingModal;
