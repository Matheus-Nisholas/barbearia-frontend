import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';


export default function ProtectedRoute() {
  const { user, token } = useAuth();


  if (!token || user?.role !== 'ADMIN') {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}