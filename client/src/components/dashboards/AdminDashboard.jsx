import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link,Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import UserTable from '../UserTable';
import Auth from '../../utils/Auth';
import Navbar from '../Navbar';
import PaymentPage from '../PaymentPage'


const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const adminId = user._id;
      try {
        const response = await axios.post('/admin/users',{adminId:adminId} ,{
          headers: "Bearer " + Auth.getToken(),
        });
        if (response.data.length === 0) {
          return setUsers([]);
        }
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchUsers();
    }
  }, [user]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  else if (!user.isPaid){
    return(
      <>
      <PaymentPage />
      </>
    );
  }
  else
  {
  return (
    <>
    <Navbar />
    
    <div className="container mx-auto px-4 py-8">
      
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      {/* Admin Information */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-2">Admin Information</h2>
        <p><strong>Business Name:</strong> {user.businessName}</p>
        <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>Payment Status:</strong> {user.isPaid ? 'Paid' : 'Not Paid'}</p>
        {user.isPaid && (
          <p><strong>Payment Type:</strong> {user.paymentType}</p>
        )}
        <p><strong>Users Managed:</strong> {users.length}</p>
                {/* edit prodile button */}
                <Link to="/admin/profile" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 inline-block">
          Edit Profile
        </Link>
      </div>

      {/* User Management Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-2">User Management</h2>
        <UserTable users={users} />

        {/* Add User Button */}
        <Link 
          to="/admin/users/add" // Update to your add user page route
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4 inline-block"
        >
          Add User
        </Link>
      </div>

    </div>
    </>
  );
}
};

export default AdminDashboard;