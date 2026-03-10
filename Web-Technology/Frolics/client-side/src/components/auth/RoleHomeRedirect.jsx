import React from 'react';
import { Navigate } from 'react-router-dom';
import { getDefaultRouteForUser } from '../../utils/auth';

const RoleHomeRedirect = () => {
  return <Navigate to={getDefaultRouteForUser()} replace />;
};

export default RoleHomeRedirect;
