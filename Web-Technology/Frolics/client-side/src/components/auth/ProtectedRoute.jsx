import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { clearAuthStorage, hasValidToken, isAdminUser } from '../../utils/auth';

const ProtectedRoute = () => {
  const location = useLocation();

  if (!hasValidToken()) {
    clearAuthStorage();
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (location.pathname.startsWith('/app/admin') && !isAdminUser()) {
    return <Navigate to="/app" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
