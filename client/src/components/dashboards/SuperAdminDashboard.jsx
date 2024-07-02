import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate,Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import AdminTable from '../AdminTable';
import Auth from '../../utils/Auth';
import Navbar from '../Navbar';

const SuperAdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const fetchAdmins = async () => {
    try {
      const response = await axios.get('/superadmin/admins', {
        headers: Auth.authHeader(),
      });
      setAdmins(response.data);
    } catch (error) {
      console.error('Error fetching admins:', error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {


    if (user) {
      fetchAdmins();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
    <Navbar />
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Superadmin Dashboard</h1>

      {/* Superadmin Information */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <p><strong>Admins Managed:</strong> {admins.length}</p>
        <p><strong>Admins Paid:</strong> {admins.filter(admin => admin.isPaid).length}</p>
      </div>

      {/* Admin Management Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-2">Admin Management</h2>
        <AdminTable users={admins} />

        {/* Add Admin Button */}
        <Link
          to="/superadmin/admins/add" // Update to your add admin page route
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4 inline-block"
        >
          Add Admin
        </Link>
      </div>

      {/* Forms submitted related to this admin business */}
    </div>
    </>
  );
};

export default SuperAdminDashboard;