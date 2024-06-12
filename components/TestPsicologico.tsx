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
  const [direction, setDirection] = useState(1);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleAnswer = () => {
    if (selectedOption === null) return;
    const points = questions[currentQuestionIndex].options[selectedOption].points;
    setScores((currentScores) => {
      const updatedScores = { ...currentScores };
      Object.keys(points).forEach((profile) => {
        updatedScores[profile] = (updatedScores[profile] || 0) + points[profile];
      });
      return updatedScores;
    });

    if (currentQuestionIndex < questions.length - 1) {
      setDirection(1);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    } else {
      setLoading(true);
      setTimeout(() => {
        calculateAndShowResults();
      }, 1000); // Simula un tiempo de carga
    }
  };

  const goBackToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setDirection(-1);
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedOption(null);
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
    hidden: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    visible: { x: 0, opacity: 1, transition: { duration: 0.2 } },
    exit: (direction: number) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
      transition: { duration: 0.2 },
    }),
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center flex-col gap-2 items-center h-[100dvh] bg-neutral-950 text-white"
      >
        <Loader />
        <p className="mt-4">Procesando tu resultado</p>
      </motion.div>
    );
  }

  if (resultMessage && dominantProfile) {
    return (
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col justify-center items-center p-4 bg-neutral-950 text-white"
      >
        <p className="text-lg mb-4">{resultMessage}</p>
        <button
          onClick={() => onComplete(dominantProfile)}
          className="mt-4 bg-gradient-to-br from-yellow-500/10 to-transparent border border-yellow-500/60 text-white font-normal py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
        >
          Continuar
        </button>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center overflow-y-auto bg-neutral-950 text-white">
      <div className="w-full">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentQuestionIndex}
            custom={direction}
            variants={questionAnimation}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full"
          >
            <h2 className="text-xl font-semibold p-5 py-6">{questions[currentQuestionIndex].questionText}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 ">
              {questions[currentQuestionIndex].options.map((option, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedOption(index)}
                  className={`relative text-white border ${
                    selectedOption === index ? 'bg-gradient-to-br from-yellow-500/20 to-transparent border-yellow-500 ' : 'border-white/10'
                  } focus:outline-none font-light rounded-2xl text-sm text-center transition flex justify-center items-center duration-300 ease-in-out cursor-pointer py-7 px-5`}
                >
                  {option.text}
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="flex justify-between flex-col items-center p-7  font-light w-full">
          <button
            onClick={handleAnswer}
            disabled={selectedOption === null}
            className={`border mb-2 border-white/40 text-white py-2 px-6 rounded-md transition duration-300 ease-in-out ${
              selectedOption === null ? 'opacity-50 cursor-not-allowed' : 'hover:scale-95'
            }`}
          >
            Continuar
          </button>
          {currentQuestionIndex > 0 && (
            <button
              onClick={goBackToPreviousQuestion}
              className=" text-white py-2 px-6 rounded-md transition duration-300 ease-in-out hover:scale-95"
            >
              Volver a la pregunta anterior
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Test;
