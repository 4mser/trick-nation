'use client'
import React, { useState } from 'react';
import UserList from '../components/UserList';
import TrickList from '../components/TrickList';
import FilterBar from '../components/FilterBar';
import Header from '@/components/Header';
import ProtectedRoute from '@/components/ProtectedRoute';

const HomePage: React.FC = () => {

  return (
    <ProtectedRoute>
      <UserList /> 
    </ProtectedRoute>
  );
};

export default HomePage;
