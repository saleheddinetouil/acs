// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5000';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Get user role from token
          const decodedToken = JSON.parse(atob(token.split('.')[1]));
          const role = decodedToken.userId ? 'user' :
                       decodedToken.adminId ? 'admin' :
                       decodedToken.superAdminId ? 'superadmin' : null;

          if (!role) {
            throw new Error('Invalid token payload: Role not found');
          }

          const response = await axios.get(`/${role}`, { // Fetch data based on role
            headers: { Authorization: `Bearer ${token}` },
          });

          setUser({ ...response.data, role });

        } catch (error) {
          console.error('Token verification failed:', error);
          localStorage.removeItem('token'); // Remove invalid token
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    verifyToken(); // Call the async function
  }, []); // Empty dependency array means this runs only once on mount

  const login = async (email, password, role) => {
    try {
      const response = await axios.post(`/auth/${role}`, { 
        email, 
        password 
      });

      localStorage.setItem('token', response.data.token);
      
      // Get user role from token
      const decodedToken = JSON.parse(atob(response.data.token.split('.')[1]));
      const userRole = decodedToken.userId ? 'user' :
                       decodedToken.adminId ? 'admin' :
                       decodedToken.superAdminId ? 'superadmin' : null;

      if (!userRole) {
        throw new Error('Invalid token payload: Role not found');
      }

      const dataResponse = await axios.get(`/${userRole}`, { // Fetch data based on role
        headers: { Authorization: `Bearer ${response.data.token}` },
      });
      setUser({ ...dataResponse.data, role: userRole });

      return response.data; 
    } catch (error) {
      throw error; 
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };