import React, { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom'; // Import Outlet
import { AuthContext } from '../context/AuthContext'; 

const ProtectedRoute = ({ roles }) => {
  const { user, isLoading } = useContext(AuthContext);
  let location = useLocation();

  if (isLoading) { 
    return <div>Loading...</div>; 
  }

  if (!user) {
    // Redirect to login page if user is not logged in
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    // Redirect to home if unauthorized 
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Render the child routes (using Outlet) if authorized
  return <Outlet />;
};

export default ProtectedRoute;