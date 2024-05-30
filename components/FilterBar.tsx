import React from 'react';

interface FilterBarProps {
  setShowUsers: (showUsers: boolean) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ setShowUsers }) => {
  return (
    <div className="flex justify-center my-4">
      <button
        onClick={() => setShowUsers(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-md mx-2 hover:bg-blue-700"
      >
        Users
      </button>
      <button
        onClick={() => setShowUsers(false)}
        className="px-4 py-2 bg-blue-600 text-white rounded-md mx-2 hover:bg-blue-700"
      >
        Tricks
      </button>
    </div>
  );
};

export default FilterBar;
