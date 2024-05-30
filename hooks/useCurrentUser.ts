'use client';

import { useAuth } from '@/context/auth-context';

const useCurrentUser = () => {
  const { user, loading, refetch } = useAuth();
  return { user, loading, refetch };
};

export default useCurrentUser;
