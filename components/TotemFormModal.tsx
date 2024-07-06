import React, { useState, useRef, useEffect } from 'react';
import api from '@/services/api';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

const categoriesList = [
  { name: 'Naturaleza', icon: '/assets/categories/naturaleza.svg' },
  { name: 'Rutas y Aventuras', icon: '/assets/categories/rutas.svg' },
  { name: 'Comidas y Bebidas', icon: '/assets/categories/comidas.svg' },
  { name: 'Deporte y Fitness', icon: '/assets/categories/deporte.svg' },
  { name: 'Actividades y Eventos', icon: '/assets/categories/eventos.svg' },
  { name: 'Educación y Cultura', icon: '/assets/categories/cultura.svg' },
  { name: 'Activismo y Medioambiente', icon: '/assets/categories/medioambiente.svg' },
  { name: 'Ciencia y Tecnología', icon: '/assets/categories/ciencia.svg' },
  { name: 'Emprendimientos', icon: '/assets/categories/emprendimientos.svg' },
  { name: 'Exploración Urbana', icon: '/assets/categories/exploracion.svg' },
  { name: 'Arte y Creatividad', icon: '/assets/categories/arte.svg' },
  { name: 'Salud y Bienestar', icon: '/assets/categories/salud.svg' },
  { name: 'Belleza y Estilo', icon: '/assets/categories/belleza.svg' },
  { name: 'Historia y Patrimonio', icon: '/assets/categories/historia.svg' },
];

interface TotemFormModalProps {
  onClose: () => void;
  userLocation: [number, number];
  userId: string;
  onTotemCreated: () => void;
}

const TotemFormModal: React.FC<TotemFormModalProps> = ({ onClose, userLocation, userId, onTotemCreated }) => {
  const [name, setName] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<[number, number]>(userLocation);
  const [is3DModel, setIs3DModel] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (mapContainer.current && !map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        accessToken: MAPBOX_TOKEN,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: userLocation,
        zoom: 17,
      });

      markerRef.current = new mapboxgl.Marker()
        .setLngLat(userLocation)
        .addTo(map.current);

      map.current.on('click', (e) => {
        const newLocation: [number, number] = [e.lngLat.lng, e.lngLat.lat];
        setSelectedLocation(newLocation);

        if (markerRef.current) {
          markerRef.current.setLngLat(newLocation);
        }
      });
    }
  }, [userLocation]);

  useEffect(() => {
    if (fileInputRef.current && is3DModel) {
      fileInputRef.current.setAttribute('webkitdirectory', 'true');
      fileInputRef.current.setAttribute('directory', 'true');
    } else if (fileInputRef.current) {
      fileInputRef.current.removeAttribute('webkitdirectory');
      fileInputRef.current.removeAttribute('directory');
    }
  }, [fileInputRef, is3DModel]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image) {
      console.error('No image selected');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('discoveredByUserId', userId);
    formData.append('location[type]', 'Point');
    formData.append('location[coordinates][0]', selectedLocation[0].toString());
    formData.append('location[coordinates][1]', selectedLocation[1].toString());
    formData.append('files', image);
    selectedCategories.forEach((category, index) => {
      formData.append(`categories[${index}]`, category);
    });

    if (files) {
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i], (files[i] as any).webkitRelativePath);
      }
    }

    try {
      console.log('Sending form data...');
      await api.post('/totems', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onTotemCreated();
      onClose();
    } catch (error) {
      console.error('Failed to create totem:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(e.target.files);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prevCategories =>
      prevCategories.includes(category)
        ? prevCategories.filter(c => c !== category)
        : [...prevCategories, category]
    );
  };

  return (
    <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white/10 overflow-y-auto h-[100dvh] backdrop-blur-md text-white p-8  shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Add New Totem</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Totem Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-2 outline-none text-white bg-neutral-900 border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Upload Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              checked={is3DModel}
              onChange={(e) => setIs3DModel(e.target.checked)}
              className="mr-2"
            />
            <label className="text-gray-300">This totem includes a 3D model</label>
          </div>
          {is3DModel && (
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Upload Model & Textures:</label>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                ref={fileInputRef}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          )}
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Categories:</label>
            <div className="flex overflow-x-auto space-x-2">
              {categoriesList.map((category) => (
                <button
                  type="button"
                  key={category.name}
                  onClick={() => handleCategoryChange(category.name)}
                  className={`flex-shrink-0 flex items-center px-4 py-2 text-nowrap rounded-full ${selectedCategories.includes(category.name) ? 'bg-yellow-500 text-white' : 'bg-neutral-900 text-white'}`}
                  style={{ maxWidth: '100%' }}
                >
                  <img src={category.icon} alt={category.name} className="h-6 w-6 mr-2 flex-shrink-0" />
                  <span className="truncate">{category.name}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Selected Location:</label>
            <div className="mb-2">{selectedLocation.join(', ')}</div>
            <div ref={mapContainer} style={{ width: '100%', height: '30dvh', borderRadius: '6px' }}></div>
          </div>
          <div className="flex justify-between">
            <button type="button" onClick={onClose} className="text-white px-4 py-2 rounded">Cancelar</button>
            <button type="submit" className="bg-gradient-to-br border-r border-b border-yellow-600/20 from-yellow-600/60 to-neutral-900/40 text-white px-4 py-2 rounded mr-2">Agregar Totem</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TotemFormModal;
