import React from 'react';
import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children, roles = [] }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  // Not authenticated
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role check
  if (roles.length > 0 && !roles.includes(userRole)) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return children;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string),
};

export default PrivateRoute;