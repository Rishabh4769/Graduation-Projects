import React from 'react';
import { Navigate } from 'react-router-dom';
import { clearAuthStorage, getDefaultRouteForUser, hasValidToken } from '../../utils/auth';

const PublicRoute = ({ children }) => {
  if (hasValidToken()) {
    return <Navigate to={getDefaultRouteForUser()} replace />;
  }

  clearAuthStorage();

  return children;
};

export default PublicRoute;
