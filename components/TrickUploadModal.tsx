import React, { useState } from 'react';
import api from '@/services/api';
import { useAuth } from '@/context/auth-context';

interface TrickUploadModalProps {
  trick: { _id: string; name: string; type: string };
  onClose: () => void;
  onUploadSuccess: () => void;
}

const TrickUploadModal: React.FC<TrickUploadModalProps> = ({ trick, onClose, onUploadSuccess }) => {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    if (!user) {
      setError('User not found');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', user._id);
      formData.append('trickId', trick._id);

      const response = await api.post('/usertricks', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        onUploadSuccess();
      } else {
        setError('Failed to upload file');
      }
    } catch (error) {
      setError('Failed to upload file');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Upload Video for {trick.name}</h2>
        {error && <p className="text-red-500">{error}</p>}
        <input type="file" onChange={handleFileChange} className="mb-4" />
        <button onClick={handleUpload} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
          Upload
        </button>
        <button onClick={onClose} className="ml-2 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default TrickUploadModal;
