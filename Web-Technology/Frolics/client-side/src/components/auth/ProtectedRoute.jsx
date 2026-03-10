import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { clearAuthStorage, hasValidToken, isAdminUser } from '../../utils/auth';

const ProtectedRoute = () => {
  const location = useLocation();

  if (!hasValidToken()) {
    clearAuthStorage();
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const inAdmin = location.pathname.startsWith('/app/admin');

  if (inAdmin && !isAdminUser()) {
    return <Navigate to="/app" replace />;
  }

  if (!inAdmin && isAdminUser()) {
    return <Navigate to="/app/admin/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
