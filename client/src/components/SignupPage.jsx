import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import Auth from '../utils/Auth';

// Import your icon library (e.g., Font Awesome, Heroicons)
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faEnvelope, faLock, faBuilding, faPhone, faPeopleGroup } from '@fortawesome/free-solid-svg-icons';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bname, setBname] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('/auth/signup', { name, lname, bname, email, phone, password });
      localStorage.setItem('token', response.data.token);
      navigate('/admin'); 
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  if (Auth.isLoggedIn()) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 to-purple-500"> 
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            <FontAwesomeIcon icon={faUserPlus} className="mr-2 text-lg" /> 
            Create Your Account
          </h2>

          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First Name Field */}
            <div className="relative">
              <input
                type="text"
                id="name"
                placeholder="First Name"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ paddingLeft: '2.3rem' }}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <div className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <FontAwesomeIcon icon={faUserPlus} /> 
              </div>
            </div>

            {/* Last Name Field */}
            <div className="relative">
              <input
                type="text"
                id="lname"
                placeholder="Last Name"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ paddingLeft: '2.3rem' }}
                value={lname}
                onChange={(e) => setLname(e.target.value)}
                required
              />
              <div className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <FontAwesomeIcon icon={faPeopleGroup} /> 
              </div>
            </div>

            {/* Business Name Field */}
            <div className="relative">
              <input
                type="text"
                id="bname"
                placeholder="Business Name"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ paddingLeft: '2.3rem' }}
                value={bname}
                onChange={(e) => setBname(e.target.value)}
                required
              />
              <div className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <FontAwesomeIcon icon={faBuilding} /> 
              </div>
            </div>

            {/* Phone Field */}
            <div className="relative">
              <input
                type="tel"
                id="phone"
                placeholder="Phone Number"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ paddingLeft: '2.3rem' }}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <div className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <FontAwesomeIcon icon={faPhone} /> 
              </div>
            </div>

            {/* Email Field */}
            <div className="relative">
              <input
                type="email"
                id="email"
                placeholder="Email"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ paddingLeft: '2.3rem' }}
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
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ paddingLeft: '2.3rem' }}
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
              Sign Up
            </button>

            <div className="text-center text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-500 hover:text-blue-700 font-bold">
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignupPage;