import React from 'react';
import { UserTrick } from '@/types/usertrick';

interface VideoModalProps {
  trick: UserTrick;
  onClose: () => void;
  onDelete: (id: string) => void;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>, trickId: string) => void;
  readOnly?: boolean; // Nueva propiedad opcional
}

const VideoModal: React.FC<VideoModalProps> = ({ trick, onClose, onDelete, onFileChange, readOnly }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black overflow-auto">
      <div className="">
        <button className="w-full h-10 text-gray-200 hover:text-gray-300 focus:outline-none text-left px-4" onClick={onClose}>
          Volver
        </button>
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-2/3 bg-black">
            <video controls autoPlay className="w-full h-full object-cover">
              <source src={`http://localhost:3000${trick.videoUrl}`} type="video/mp4" />
              <source src={`http://localhost:3000${trick.videoUrl}`} type="video/mov" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="w-full md:w-1/3 p-4 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">{trick.trickId.name}</h3>
            </div>
            {!readOnly && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-300">Edit Video</label>
                <label className="block bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded cursor-pointer mt-2">
                  Upload New Video
                  <input
                    type="file"
                    className="hidden"
                    onChange={(event) => onFileChange(event, trick._id)}
                  />
                </label>
                <button
                  onClick={() => onDelete(trick._id)}
                  className="block w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded mt-4"
                >
                  Delete Video
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
