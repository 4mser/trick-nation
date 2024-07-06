import React from 'react';

interface CustomSwitchProps {
  checked: boolean;
  onChange: () => void;
}

const CustomSwitch: React.FC<CustomSwitchProps> = ({ checked, onChange }) => {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-white/10 rounded-full peer   dark:peer-focus:ring-yellow-500 peer-checked:bg-gradient-to-br from-cyan-500 to-green-400 dark:peer-checked:bg-green-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-white/10 peer-checked:after:border-white"></div>
    </label>
  );
};

export default CustomSwitch;
