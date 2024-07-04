import React, { useState, useContext } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Navbar from './Navbar';
import axios from 'axios';

// Import your icon library (e.g., Font Awesome, Heroicons)
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

const LoginPage = () => {
  const { user, login } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  const fetchRole = async () => {
    try {
      const response = await axios.post('/auth/role', { email });
      setRole(response.data.role);
      return response.data.role;
    } catch (error) {
      console.error('Error fetching role:', error);
    }
  };

  fetchRole();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await login(email, password, role);
      navigate(`/${role}`);
    } catch (err) {
      setError(err.response.data.error || 'Invalid credentials');
    }
  };

  if (typeof user !== 'undefined' && user !== null) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-500">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Welcome Back!
          </h2>

          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="relative">
              <input
                type="email"
                id="email"
                placeholder="Email" // make placeholder with left margin to fit icon
                style={{ paddingLeft: '2.5rem' }}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <FontAwesomeIcon icon={faEnvelope} />
              </div>
            </div>

            {/* Password Field */}
            <div className="relative">
              <input
                type="password"
                id="password"
                placeholder="Password" 
                style={{ paddingLeft: '2.5rem' }}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <FontAwesomeIcon icon={faLock} />
              </div>
            </div>

            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline w-full transform transition duration-300 hover:scale-105" 
            >
              Login
            </button>

            <div className="text-center text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-500 hover:text-blue-700 font-bold">
                Sign Up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginPage;