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

  const handleRetakeTest = () => {
    setCurrentQuestionIndex(0);
    setScores({});
    setResultMessage(null);
    setDominantProfile(null);
    setSelectedOption(null);
  };

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

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
  className="flex flex-col justify-center items-center p-6 bg-neutral-950 text-white"
>
  <motion.p
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: 0.4, duration: 0.5 }}
    className="text-xl mb-4"
  >
    Tu rol asignado es
  </motion.p>
  <motion.h3
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ delay: 0.6, duration: 0.5 }}
    className="text-4xl font-semibold text-yellow-400 mb-6"
  >
    {dominantProfile}
  </motion.h3>
  <motion.p
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: 0.8, duration: 0.5 }}
    className="text-base pb-8 text-center "
  >
    {resultMessage}
  </motion.p>
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 1, duration: 0.5 }}
    className="flex gap-4 flex-col absolute bottom-0 left-0 w-full justify-center items-center p-7 bg-neutral-950"
  >
    <button
      onClick={() => onComplete(dominantProfile)}
      className=" border border-white/40 text-white font-normal py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out hover:scale-95"
    >
      Continuar
    </button>
    <button
      onClick={handleRetakeTest}
      className="hover:scale-95 transition-transform"
    >
      Repetir Test
    </button>
  </motion.div>
</motion.div>

    );
  }

  return (
    <div className="flex flex-col items-center  overflow-y-auto bg-neutral-950 text-white h-[100dvh] relative xl:px-52">
      <div className="w-full p-5 absolute top-0 left-0 bg-neutral-950 z-10">
        <motion.div
          className="h-2 bg-yellow-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      </div>
      <div className="w-full pt-14 pb-44">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentQuestionIndex}
            custom={direction}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <h2 className="text-xl font-semibold px-5 pb-6">{questions[currentQuestionIndex].questionText}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-5">
              {questions[currentQuestionIndex].options.map((option, index) => (
                <motion.div
                  key={index}
                  onClick={() => setSelectedOption(index)}
                  className={`relative text-white border ${
                    selectedOption === index ? 'bg-gradient-to-br from-yellow-500/20 to-transparent border-yellow-500' : 'border-white/10'
                  } focus:outline-none font-light rounded-xl text-[13px] px-3 py-3 text-center transition flex justify-center items-center duration-300 ease-in-out cursor-pointer`}
                >
                  {option.text}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="absolute bottom-0 bg-neutral-950 left-0 flex justify-between flex-col items-center py-5 mt-4 font-light w-full">
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
              className="text-white py-2 px-6 rounded-md transition duration-300 ease-in-out hover:scale-95"
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
