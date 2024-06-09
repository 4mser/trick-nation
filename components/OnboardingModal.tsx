// OnboardingModal.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { User } from '@/types/user';

interface OnboardingModalProps {
  user: User;
  onComplete: () => void;
  onSkip: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ user, onComplete, onSkip }) => {
  if (user.onboardingCompleted) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-10"
    >
      <div className="bg-neutral-900 text-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Completa tu perfil</h2>
        <p className="mb-4">Realiza el test psicologico y elige tu núcleo</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onSkip}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded text-xs"
          >
            Luego
          </button>
          <button
            onClick={onComplete}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded text-xs"
          >
            Continuar
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default OnboardingModal;
