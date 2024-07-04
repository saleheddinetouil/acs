import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import Auth from '../utils/Auth';

// Import your icon library (e.g., Font Awesome, Heroicons)
// Example for Font Awesome:
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faSignOutAlt, faSignIn, faUserPlus,faChartLine, faUserAlt, faDatabase} from '@fortawesome/free-solid-svg-icons';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const Navbar = () => {
  const { user, logout } = useContext(AuthContext); 
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userNavigation = [
    { name: 'Dashboard', href: '/' + Auth.getRole()  , icon: faDatabase},
    { name: 'Profile', href: '/' + Auth.getRole() + "/profile" , icon: faUserAlt},

    { name: 'Logout', href: '', onClick: handleLogout, icon: faSignOutAlt }, // Add icon property
  ];
  // 
  if (Auth.getRole() === 'user') {
    userNavigation.push({name:'Analytics',href:'/stats' , icon: faChartLine},);
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-gray-800">
          <img src="https://i.ibb.co/HNX7Z6h/logo.png" alt="logo" style={{height:'88px'}} />
        </Link>
        <ul className="flex space-x-6">
          {user ? ( 
            <>
              <li>
                <Menu as="div" className="relative inline-block text-left">
                  <div className="flex items-center space-x-2 cursor-pointer">

                    <MenuButton className="inline-flex items-center justify-center w-full rounded-md shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                      <FontAwesomeIcon icon={faUserCircle} className="mr-2 text-xl"  style={{fontSize: '1.5rem'}} />
                      {user.firstName}
                    </MenuButton>
                  </div>
                  <MenuItems className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {userNavigation.map((item) => (
                      <MenuItem key={item.name} style={{minWidth: '200px', padding: '0.5rem 1rem',fontSize: '1rem'}}>
                        {({ active }) => (
                          <Link
                            to={item.href}
                            className={classNames(
                              active ? 'bg-gray-100' : '',
                              'block px-4 py-2 text-sm text-gray-700 flex items-center' 
                            )}
                            onClick={item.onClick}
                          >
                            {item.icon && ( 
                              <FontAwesomeIcon icon={item.icon} className="mr-2" style={{fontSize: '1rem'}} />
                            )}
                            {item.name}
                          </Link>
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
                <Link to="/login" className="mr-4 hover:text-blue-500">
                  <FontAwesomeIcon icon={faSignIn} className="mr-2" /> Login  
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-blue-500 ">
                  <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
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