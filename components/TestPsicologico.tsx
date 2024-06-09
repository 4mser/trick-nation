// TestPsicologico.tsx
import React, { FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { questions } from '@/utils/QuestionsTest';
import { profileMessages } from '@/utils/profileMessages';
import Loader from './Loader';

interface TestProps {
  onComplete: (role: string) => void;
}

const Test: FC<TestProps> = ({ onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [dominantProfile, setDominantProfile] = useState<string | null>(null);

  const handleAnswer = (points: Record<string, number>) => {
    setScores((currentScores) => {
      const updatedScores = { ...currentScores };
      Object.keys(points).forEach((profile) => {
        updatedScores[profile] = (updatedScores[profile] || 0) + points[profile];
      });
      return updatedScores;
    });

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setLoading(true);
      setTimeout(() => {
        calculateAndShowResults();
      }, 1000); // Simula un tiempo de carga
    }
  };

  const goBackToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateAndShowResults = () => {
    const sortedProfiles = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);
    const dominantProfile = sortedProfiles[0];
    const message = profileMessages[dominantProfile];
    setDominantProfile(dominantProfile);
    setResultMessage(message);
    setLoading(false);
  };

  const questionAnimation = {
    hidden: { x: 100, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.2 } },
    exit: { x: -100, opacity: 0, transition: { duration: 0.2 } },
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center flex-col gap-2 items-center h-[100dvh]"
      >
        <Loader />
        Procesando tu resultado
      </motion.div>
    );
  }

  if (resultMessage && dominantProfile) {
    return (
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col justify-center items-center max-h-[100dvh] p-4"
      >
        <p className="text-lg">{resultMessage}</p>
        <button
          onClick={() => onComplete(dominantProfile)}
          className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Continuar
        </button>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center max-h-[100dvh]">
        {currentQuestionIndex > 0 && (
            <button
              className=" bg-green-500 hover:bg-green-700 text-white py-2 px-4 w-full text-left"
              onClick={goBackToPreviousQuestion}
            >
              {`< Volver a la pregunta anterior`}
            </button>
          )}
      <AnimatePresence mode='wait'>
        <motion.div
          key={currentQuestionIndex}
          variants={questionAnimation}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="w-full max-w-xl p-7"
        >
          <h2 className="text-xl font-bold my-6">{questions[currentQuestionIndex].questionText}</h2>
            
          {questions[currentQuestionIndex].options.map((option, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-white border border-green-500 hover:bg-green-500 focus:outline-none font-medium rounded-lg text-xs px-5 py-2.5 text-center mr-2 mb-2 w-full "
              onClick={() => handleAnswer(option.points)}
            >
              {option.text}
            </motion.button>
          ))}
          
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Test;
