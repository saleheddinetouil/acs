import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext); 
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); 
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-gray-800">
          ACS
        </Link>
        <ul className="flex space-x-6">
          {user ? ( // User is logged in
            <>
              <li className=" " style={{verticalAlign:'middle',height:'100%'}}>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => {
                  if (user.role === 'superadmin') {
                    navigate('/superadmin');
                  } else if (user.role === 'admin') {
                    navigate('/admin');
                  } else {
                    navigate('/user');
                  }
                }}>
                  Dashboard
                </button>

              </li>
              <li>
                <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                  Logout
                </button>
              </li>
            </>
          ) : ( // User is not logged in
            <>
              <li>
                <Link to="/login" className="hover:text-blue-500">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-blue-500">
                  Signup
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;