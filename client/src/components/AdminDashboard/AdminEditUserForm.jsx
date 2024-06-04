import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import Auth from '../../utils/Auth';
import Navbar from '../Navbar';

const AdminEditUserForm = () => {
  const { user } = useContext(AuthContext);
  const { userId } = useParams(); // Get userId from route parameters
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '', // Include password field (optional)
    phone: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/admin/users/${userId}`, {
          headers: Auth.authHeader(),
        });
        setFormData({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
          phone: response.data.phone,
          // Don't fetch password from server
        });
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Error fetching user data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/admin/users/${userId}`, formData, {
        headers: Auth.authHeader(),
      });
      navigate('/admin');
    } catch (err) {
      setError(err.response.data.error || 'Failed to update user.');
    }
  };

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
    <Navbar />
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Edit User</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          {/* First Name, Last Name, Email (Text Inputs) */}
          <div className="mb-4 text-left">
            <label htmlFor="firstName" className="block text-gray-700 font-bold mb-2">
              First Name:
            </label>
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
            <label htmlFor="lastName" className="block text-gray-700 font-bold mb-2">
              Last Name:
            </label>
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
            <label htmlFor="phone" className="block text-gray-700 font-bold mb-2">
              Phone:
            </label>
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
            <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
              Email:
            </label>
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



          {/* Password (Optional Text Input) */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
              Password (leave blank to keep current password):
            </label>
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
            Update User
          </button>
          <button
            onClick={async () => {
              try {
                await axios.delete(`/admin/users/${userId}`, {
                  headers: Auth.authHeader(),
                });
                navigate('/admin');
              } catch (err) {
                setError(err.response.data.error || 'Failed to delete user.');
              }
            }
            }
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-4"
          >
            Delete 
          </button>
            

        </form>
      )}
    </div>
    </>
  );
};

export default AdminEditUserForm;