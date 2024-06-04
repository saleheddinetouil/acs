import React, { useState, useContext } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Navbar from './Navbar';

const LoginPage = () => {
  const { user, login } = useContext(AuthContext);
  
  const [activeTab, setActiveTab] = useState('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await login(email, password, activeTab); 
      navigate(`/${activeTab}`); 
    } catch (err) {
      setError(err.response.data.error || 'Invalid credentials');
    }
  };
  if(typeof user !== 'undefined' && user !== null) {
    return <Navigate to={`/${user.role}`} replace />;
  }
  
  return (
    <>
    <Navbar />
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="container mx-auto bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Login Portal</h2>
        
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6 justify-center">
          <button 
            onClick={() => setActiveTab('user')}
            className={`py-2 px-4 font-medium text-gray-700 ${activeTab === 'user' ? 'border-b-2 border-blue-500' : ''}`}
          >
            User
          </button>
          <button 
            onClick={() => setActiveTab('admin')}
            className={`py-2 px-4 font-medium text-gray-700 ${activeTab === 'admin' ? 'border-b-2 border-blue-500' : ''}`}
          >
            Admin
          </button>
          <button 
            onClick={() => setActiveTab('superadmin')}
            className={`py-2 px-4 font-medium text-gray-700 ${activeTab === 'superadmin' ? 'border-b-2 border-blue-500' : ''}`}
          >
            Super
          </button>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2 flex flex-start ml-4 ">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {/* Password Field */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2 flex flex-start ml-4 ">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Login
          </button>
          <p className="mt-4 text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-500 hover:text-blue-700 font-bold">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
    </>
  );
};

export default LoginPage;