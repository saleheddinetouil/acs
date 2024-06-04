import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Auth from '../utils/Auth';
import Navbar from './Navbar';

const AdminProfileEdit = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [users,setUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '', // Optional: for password change
    phone: '',
    businessName: '',

  });
  const [isLoading, setIsLoading] = useState(true); 
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user.role === 'user') {
        setFormData({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            
        });
    } else if (user.role === 'admin') {
        setFormData({
            userId: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            businessName: user.businessName,
        });
    } else if (user.role === 'superadmin') {
        setFormData({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        });
    }
    setIsLoading(false);
    }, [user]);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage(null);
    setError(null); 

    try {
      const response = await axios.put('/admin/profile', formData, {
        headers: Auth.authHeader()
      });

      // Update user data in the AuthContext
      setUser(response.data.user); 
      setSuccessMessage('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update error:', error);
      setError(error.response.data.error || 'Failed to update profile.');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />; 
  }

  return (
    <>
    <Navbar />
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Edit Profile</h1>

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
        
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <label htmlFor="firstName" className="block text-gray-700 font-bold mb-2 text-left">First Name:</label>
          <input 
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required 
          />
        </div>
        <div className="mb-4">
            <label htmlFor="lastName" className="block text-gray-700 font-bold mb-2 text-left">Last Name:</label>
            <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
            />
        </div>
        <div className="mb-4">
            <label htmlFor="businessName" className="block text-gray-700 font-bold mb-2 text-left">Business Name:</label>
            <input
                type="text"
                id="businessName"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
        </div>



        <div className="mb-4">  
            <label htmlFor="email" className="block text-gray-700 font-bold mb-2 text-left">Email:</label>
            <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
            />
        </div>


        <div className="mb-4">
          <label htmlFor="phone" className="block text-gray-700 font-bold mb-2 text-left">Phone:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        
        {/* Password (Optional Text Input) */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 font-bold mb-2 text-left">New Password (optional):</label>
          <input
            type="password" 
            id="password"
            name="password"
            value={formData.password} 
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
          />
        </div>

        <button 
          type="submit" 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Save Changes
        </button>
      </form>
    </div>
    </>
  );
};

export default AdminProfileEdit;