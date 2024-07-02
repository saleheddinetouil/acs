import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import Auth from '../utils/Auth';





const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bname, setBname] = useState('');
  const [error, setError] = useState(null);
  const [lname, setLname] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('/auth/signup', { name,lname,bname, email,phone, password });

      localStorage.setItem('token', response.data.token);
      navigate('/admin'); // Redirect to user dashboard (or appropriate role dashboard)
    } catch (err) {
      setError(err.response.data.message);
    }
  };

  const handleLoading = () => {
    if (error) {
      return 'Loading...';
    }
    
  };
  // if connected navigate to admin dashboard
  if (Auth.isLoggedIn()) {
    return <Navigate to="/" replace />;
  }







  


  
  return (
    <>
    <Navbar />
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="container mx-auto bg-white rounded-lg shadow-md p-8 w-96">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Sign Up</h2>
        {error && <p className="text-red-500 mb-4 ">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4 text-left">
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
              First Name
            </label>
            <input
              type="text"
              id="name"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-4 text-left">
            <label htmlFor="lname" className="block text-gray-700 text-sm font-bold mb-2 ">
              Last Name 
            </label>
            <input
              type="text"
              id="lname"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline "
              value={lname}
              onChange={(e) => setLname(e.target.value)}
            />
          </div>
<div className="mb-4 text-left">
            <label htmlFor="bname" className="block text-gray-700 text-sm font-bold mb-2">
              Business Name
            </label>
            <input
              type="text"
              id="bname"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={bname}
              onChange={(e) => setBname(e.target.value)}
            />
          </div>
          <div className="mb-4 text-left">
            <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">
              Phone
            </label>
            <input
              type="text"
              id="phone"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}                  
            />
          </div>



          <div className="mb-4 text-left">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4 text-left">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus-shadow-outline"
            >
              Sign Up
            </button>
            <Link to="/login" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
              Already have an account? Login
            </Link>
          </div>
        </form>
      </div>
    </div>
    </>
  );
};

export default SignupPage;