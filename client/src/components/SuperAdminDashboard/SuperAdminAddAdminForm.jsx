import React, { useState, useContext } from 'react';
import { useNavigate,Navigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import Auth from '../../utils/Auth'; 
import Navbar from '../Navbar';

const SuperAdminAddAdminForm = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    businessName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    if (error) setError(null);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.phone.length !== 11) {
      setError('Phone number must be 11 digits.');
      return;
    }
    let i = 0;
    for (i = 0; i < formData.phone.length; i++) {
      if (isNaN(formData.phone.charAt(i))) {
        setError('Phone number must be numeric.');
        return;
      }
    }



    
    try {
      await axios.post('/superadmin/admins/add', formData, { // Add admin route
        headers: Auth.authHeader(),
      });
      navigate('/superadmin'); 
    } catch (err) {
      setError(err.response.data.error || 'Failed to create admin.');
    }
  };

  if (!user || user.role !== 'superadmin') {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
    <Navbar />
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Add New Admin</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        {/* First Name, Last Name, Email, Password (Text Inputs) */}
        <div className="mb-4 text-left">
          <label htmlFor="firstName" className="block text-gray-700 font-bold mb-2">First Name:</label>
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
        <div className="mb-4 text-left">

          <label htmlFor="lastName" className="block text-gray-700 font-bold mb-2">Last Name:</label>
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
        <div className="mb-4 text-left">
          <label htmlFor="businessName" className="block text-gray-700 font-bold mb-2">Business Name:</label>
          <input
            type="text"
            id="businessName"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4 text-left">
          <label htmlFor="phone" className="block text-gray-700 font-bold mb-2">Phone:</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        

        <div className="mb-4 text-left">
            <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email:</label>
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


        <div className="mb-4 text-left">
            <label htmlFor="password" className="block text-gray-700 font-bold mb-2">Password:</label>
            <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
            />
        </div>
       


        

        <button 
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Create Admin
        </button>

        <button 
          onClick={() => navigate('/superadmin')}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-4"
        >
          Cancel
        </button>
        

      </form>
    </div>
    </>
  );
};

export default SuperAdminAddAdminForm;