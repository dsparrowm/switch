import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { selectCurrentAuth } from '../features/auth/authSlice';
import { useSelector } from 'react-redux';

function RequireAuth ({ children }) {
  const location = useLocation();
  const isAuthenticated = useSelector(selectCurrentAuth);

  if (!isAuthenticated) {
    return <Navigate to='/login' state={{ path: location.pathname }} />;
  }

  return children;
}

export default RequireAuth;
