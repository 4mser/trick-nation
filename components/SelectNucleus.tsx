'use client'
import React, { useState } from 'react';


interface SelectNucleusProps {
  onComplete: (nucleus: string) => void;
}

const SelectNucleus: React.FC<SelectNucleusProps> = ({ onComplete }) => {
  const [selectedNucleus, setSelectedNucleus] = useState<string | null>(null);

  const handleSelect = (nucleus: string) => {
    setSelectedNucleus(nucleus);
  };

  const handleSubmit = () => {
    if (selectedNucleus) {
      onComplete(selectedNucleus);
    }
  };

  const nucleiOptions = ['Enigma', 'Quantum', 'Arbóreo', 'Áureo'];

  return (
    <div className="flex flex-col items-center justify-center max-h-[100dvh] p-4">
      <h2 className="text-2xl font-bold mb-6">Selecciona tu Núcleo</h2>
      <div className="flex flex-wrap justify-center mb-6">
        {nucleiOptions.map((nucleus) => (
          <button
            key={nucleus}
            onClick={() => handleSelect(nucleus)}
            className={`m-2 p-4 rounded-lg shadow-md text-white font-bold ${selectedNucleus === nucleus ? 'bg-blue-500' : 'bg-gray-700'} hover:bg-blue-600`}
          >
            {nucleus}
          </button>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Confirmar
      </button>
    </div>
  );
};

export default SelectNucleus;
