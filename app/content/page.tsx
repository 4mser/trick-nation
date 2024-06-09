'use client'
import ProtectedRoute from '@/components/ProtectedRoute';
import TrickTree from '@/components/TrickTree';

const HomePage: React.FC = () => {

  return (
    <ProtectedRoute>
        <TrickTree />
    </ProtectedRoute>
  );
};

export default HomePage;
