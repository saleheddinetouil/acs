import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import Auth from '../utils/Auth';




function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const Navbar = () => {
  const { user, logout } = useContext(AuthContext); 
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };






  const userNavigation = [
    { name: 'Dashboard', href: '/'+Auth.getRole() },
    { name: 'Profile', href: '/'+Auth.getRole()+"/profile" },
    { name: 'Logout', href: '' , onClick: handleLogout},
  ]


  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">

      
        
        <Link to="/" className="text-xl font-bold text-gray-800">
          <img src="https://i.ibb.co/HNX7Z6h/logo.png" alt="logo" style={{height:'88px'}} />
        </Link>
        <ul className="flex space-x-6">
          {user ? ( // User is logged in
            <>

              <li>

                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <MenuButton className="inline-flex justify-center w-full rounded-md shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                      <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQv_oL1l60gN7zHc_fMS11OeFR-mLDi3DgjNg&s' className='h-9 w-9' alt='profile' />
                    </MenuButton>
                  </div>
                  <MenuItems className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {userNavigation.map((item) => (
                      <MenuItem key={item.name}>
                        {({ active }) => (
                          <>

                          <Link
                            to={item.href}
                            className={classNames(
                              active ? 'bg-gray-100' : '',
                              'block px-4 py-2 text-sm text-gray-700'
                            )}
                            onClick={item.onClick}
                          >
                            {item.name}
                          </Link>

                                        </>
                        )}
          
                      </MenuItem>
                    ))}
                  </MenuItems>
                </Menu>
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