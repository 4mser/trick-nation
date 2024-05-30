'use client';

import React, { useEffect, useState } from 'react';
import { User } from '../types/user';
import api from '@/services/api';
import { useAuth } from '@/context/auth-context';
import Link from 'next/link';

const UserList: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get<User[]>('/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {users
        .filter(user => user._id !== currentUser?._id)
        .map(user => (
          <Link key={user._id} href={`/users/${user._id}`}>
            <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center space-x-4">
                <img
                  src={user.profilePictureUrl ? `${user.profilePictureUrl}` : '/profile.jpeg'}
                  alt="Profile Picture"
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h3 className="text-lg font-semibold">{user.username}</h3>
                </div>
              </div>
            </div>
          </Link>
        ))}
    </div>
  );
};

export default UserList;
