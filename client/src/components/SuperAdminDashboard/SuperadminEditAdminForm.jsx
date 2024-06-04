import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import Auth from '../../utils/Auth';
import Navbar from '../Navbar';


const SuperadminEditAdminForm = () => {
  const { user } = useContext(AuthContext);
  const { adminId } = useParams(); // Get adminId from route parameters
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '', 
    isPaid: false, 
    paymentType: 'cash',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const response = await axios.get(`/superadmin/admins/${adminId}`, {
          headers: Auth.authHeader(),
        });
        setFormData({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
          // Don't fetch password from server
          isPaid: response.data.isPaid,
          paymentType: response.data.paymentType, 
          
        });
      } catch (err) {
        console.error('Error fetching admin data:', err);
        setError('Error fetching admin data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdmin();
  }, [adminId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, [name]: inputValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/superadmin/admins/${adminId}`, formData, {
        headers: Auth.authHeader(),
      });
      navigate('/superadmin');
    } catch (err) {
      setError(err.response.data.error || 'Failed to update admin.');
    }
  };

  if (!user || user.role !== 'superadmin') {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
    <Navbar />
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Edit Admin</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          <div className='mb-4 text-left'>
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
          <div className='mb-4 text-left'>
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
          <div className='mb-4 text-left'>
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
          
          <div className='mb-4 text-left'>
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
          <div className='mb-4 text-left'>
            <label htmlFor="password" className=" block text-gray-700 font-bold mb-2">Password (Leave blank to keep the same):</label>

            <input
              type="password"
              id="password"
              name="password"

              value={formData.password}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              
            />
          </div>






          {/* Payment Status (Checkbox) */}
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="isPaid"
              name="isPaid"
              checked={formData.isPaid}
              onChange={handleChange}
              className="mr-2" 
            />
            <label htmlFor="isPaid" className="block text-gray-700 font-bold">
              Paid
            </label>
          </div>

          {/* Payment Type (Select - Conditionally Rendered) */}
          {formData.isPaid && (
            <div className="mb-4">
              <label htmlFor="paymentType" className="block text-gray-700 font-bold mb-2">
                Payment Type:
              </label>
              <select
                id="paymentType"
                name="paymentType"
                value={formData.paymentType}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
            </div>
          )}

          <button
            type="submit"

            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Update Admin
          </button>
          <button 
            type='button'
              onClick={async () => {
                try {
                  await axios.delete(`/superadmin/admins/${adminId}`, {
                    headers: Auth.authHeader(),
                  });
                  navigate('/superadmin');
                } catch (error) {
                  console.error('Error deleting admin:', error);
                }
              }
            }


          className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-4'>
            Delete
          </button>


        </form>
      )}
    </div>
    </>
  );
};

export default SuperadminEditAdminForm;