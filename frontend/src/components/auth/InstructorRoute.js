import React from 'react';
import { Navigate } from 'react-router-dom';

const InstructorRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (userRole !== 'instructor') {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default InstructorRoute;
