import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Trick } from '../types/tricks';
import TrickUploadModal from './TrickUploadModal';
import { useAuth } from '@/context/auth-context';
import { UserTrick } from '@/types/usertrick';

interface TrickNode extends Trick {
  unlocked: boolean;
  children?: TrickNode[];
  difficulty: string;
}

const TrickTree: React.FC = () => {
  const [trickTree, setTrickTree] = useState<{ [key: string]: TrickNode[] }>({});
  const [selectedTrick, setSelectedTrick] = useState<TrickNode | null>(null);
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All Difficulties');
  const [showUnlocked, setShowUnlocked] = useState(false);
  const [filteredTricks, setFilteredTricks] = useState<{ [key: string]: TrickNode[] }>({});

  useEffect(() => {
    const fetchTricks = async () => {
      try {
        const [tricksResponse, userTricksResponse] = await Promise.all([
          api.get<{ [key: string]: TrickNode[] }>('/tricks/tree'),
          user ? api.get<UserTrick[]>(`/usertricks/user/${user._id}`) : Promise.resolve({ data: [] }),
        ]);

        const userTricks = userTricksResponse.data.map(ut => ut.trickId._id);

        const updatedTrickTree = Object.keys(tricksResponse.data).reduce((acc, type) => {
          acc[type] = tricksResponse.data[type].map(trick => ({
            ...trick,
            unlocked: userTricks.includes(trick._id),
          }));
          return acc;
        }, {} as { [key: string]: TrickNode[] });

        setTrickTree(updatedTrickTree);
        setFilteredTricks(updatedTrickTree);
      } catch (error) {
        console.error('Failed to fetch tricks:', error);
      }
    };

    fetchTricks();
  }, [user]);

  useEffect(() => {
    let filtered = { ...trickTree };

    if (selectedType !== 'All Types') {
      filtered = {
        [selectedType]: filtered[selectedType] || []
      };
    }

    if (selectedDifficulty !== 'All Difficulties') {
      filtered = Object.keys(filtered).reduce((acc, key) => {
        acc[key] = filtered[key].filter(trick => trick.difficulty === selectedDifficulty);
        return acc;
      }, {} as { [key: string]: TrickNode[] });
    }

    if (showUnlocked) {
      filtered = Object.keys(filtered).reduce((acc, key) => {
        acc[key] = filtered[key].filter(trick => trick.unlocked);
        return acc;
      }, {} as { [key: string]: TrickNode[] });
    }

    if (searchTerm) {
      filtered = Object.keys(filtered).reduce((acc, key) => {
        acc[key] = filtered[key].filter(trick => trick.name.toLowerCase().includes(searchTerm.toLowerCase()));
        return acc;
      }, {} as { [key: string]: TrickNode[] });
    }

    setFilteredTricks(filtered);
  }, [searchTerm, selectedType, selectedDifficulty, showUnlocked, trickTree]);

  const handleUnlock = (trick: TrickNode) => {
    setSelectedTrick(trick);
  };

  const renderTree = (nodes: TrickNode[]) => {
    // Primero, se mueven los desbloqueados al frente
    const sortedNodes = nodes.sort((a, b) => b.unlocked ? 1 : -1);

    return (
      <div className="flex space-x-4 overflow-x-auto px-4 pb-4 pt-2">
        {sortedNodes.map((node) => (
          <div
            key={node._id}
            className={`relative flex-none w-40 h-40 p-4 rounded-lg shadow-md transition-transform duration-300 transform hover:scale-105 ${
              node.unlocked ? 'bg-green-500' : 'bg-gray-700'
            }`}
          >
            <div className="text-center">
              <h3 className="text-lg font-bold mb-2">{node.name}</h3>
              <p className="text-sm mb-2">{node.difficulty}</p>
              {!node.unlocked && (
                <button
                  onClick={() => handleUnlock(node)}
                  className="mt-2 bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded"
                >
                  Unlock
                </button>
              )}
              {node.unlocked && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-white text-green-500 px-2 py-1 text-xs font-bold rounded-tl-lg rounded-tr-lg">
                  Unlocked
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="trick-tree-container text-white rounded-lg shadow-lg max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center mb-4">
        <input
          type="text"
          className="search-input bg-gray-700 text-white p-2 rounded-lg mb-4 md:mb-0 md:mr-4"
          placeholder="Search tricks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="filter-select bg-gray-700 text-white p-2 rounded-lg mb-4 md:mb-0 md:mr-4"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="All Types">All Types</option>
          <option value="Basic Tricks">Basic Tricks</option>
          <option value="Flip and Shove-It Tricks">Flip and Shove-It Tricks</option>
          <option value="Grind and Slide Tricks">Grind and Slide Tricks</option>
          <option value="Air, Grab, Bowl and Ramp Tricks">Air, Grab, Bowl and Ramp Tricks</option>
          <option value="Footplant Tricks">Footplant Tricks</option>
          <option value="Balance Tricks">Balance Tricks</option>
          <option value="Miscellaneous Freestyle and Old School Tricks">Miscellaneous Freestyle and Old School Tricks</option>
        </select>
        <select
          className="filter-select bg-gray-700 text-white p-2 rounded-lg mb-4 md:mb-0 md:mr-4"
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
        >
          <option value="All Difficulties">All Difficulties</option>
          <option value="Fácil">Fácil</option>
          <option value="Intermedio">Intermedio</option>
          <option value="Difícil">Difícil</option>
        </select>
        <label className="flex items-center mb-4 md:mb-0">
          <input
            type="checkbox"
            className="form-checkbox bg-gray-700 text-white mr-2"
            checked={showUnlocked}
            onChange={(e) => setShowUnlocked(e.target.checked)}
          />
          Show Unlocked
        </label>
      </div>
      {Object.keys(filteredTricks).map((type) => (
        filteredTricks[type].length > 0 && (
          <div key={type} className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">{type}</h2>
            {renderTree(filteredTricks[type])}
          </div>
        )
      ))}
      {selectedTrick && user && (
        <TrickUploadModal
          trick={selectedTrick}
          onClose={() => setSelectedTrick(null)}
          onUploadSuccess={() => {
            setSelectedTrick(null);
            const fetchTricks = async () => {
              try {
                const [tricksResponse, userTricksResponse] = await Promise.all([
                  api.get<{ [key: string]: TrickNode[] }>('/tricks/tree'),
                  user ? api.get<UserTrick[]>(`/usertricks/user/${user._id}`) : Promise.resolve({ data: [] }),
                ]);

                const userTricks = userTricksResponse.data.map(ut => ut.trickId._id);

                const updatedTrickTree = Object.keys(tricksResponse.data).reduce((acc, type) => {
                  acc[type] = tricksResponse.data[type].map(trick => ({
                    ...trick,
                    unlocked: userTricks.includes(trick._id),
                  }));
                  return acc;
                }, {} as { [key: string]: TrickNode[] });

                setTrickTree(updatedTrickTree);
                setFilteredTricks(updatedTrickTree);
              } catch (error) {
                console.error('Failed to fetch tricks:', error);
              }
            };

            fetchTricks();
          }}
        />
      )}
    </div>
  );
};

export default TrickTree;