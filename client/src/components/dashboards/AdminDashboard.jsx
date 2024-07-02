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
  const [forms, setForms] = useState([]);
  const [admin, setAdmin] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const response = await axios.get(`/admin/${user._id}`, {
          headers: "Bearer " + Auth.getToken(),
        });
        setAdmin(response.data);
      } catch (error) {
        console.error('Error fetching admin:', error);
      }
    };



    const fetchForms = async () => {
      try {
        const response = await axios.post('/admin/forms',
        {adminId:user._id}, {
          headers: "Bearer " + Auth.getToken(),
      });
        setForms(response.data);
      } catch (error) {
        console.error('Error fetching forms:', error);
      }
    };



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
      fetchForms();
    }

    if (user && user.role === 'admin') {
      fetchAdmin();
      setAdmin(user);
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

      {/* Forms submitted by users of the admin */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-2">Forms Submitted by Users</h2>
        {/* Forms Table */}
        <table className="w-full">
          <thead>
            <tr>
              <th className="border px-4 py-2">Num</th>  
              <th className="border px-4 py-2">User</th>
              <th className="border px-4 py-2">Submitted At</th>
              <th className="border px-4 py-2">Updated By</th>
              <th className="border px-4 py-2">Updated At</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {forms.map(form => (
              <tr key={form._id}>
                <td className="border px-4 py-2">{form.numId}</td>
                <td className="border px-4 py-2">{form.userId}</td>
                <td className="border px-4 py-2">{form.createdAt}</td>
                <td className="border px-4 py-2">{form.lastEditedBy}</td>
                <td className="border px-4 py-2">{form.updatedAt}</td>
                <td className="border px-4 py-2">
                  <Link to={`/admin/forms/${form._id}`} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    View
                  </Link>
                </td>
                


              </tr>
            ))} 
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
}
};

export default AdminDashboard;
