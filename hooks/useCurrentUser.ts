'use client';

import { useAuth } from '@/context/auth-context';
import { User } from '@/types/user';

const useCurrentUser = () => {
  const { user, loading, refetch } = useAuth() as {
    user: User | null;
    loading: boolean;
    refetch: () => Promise<void>;
  };

  return { user, loading, refetch };
};

export default useCurrentUser;
