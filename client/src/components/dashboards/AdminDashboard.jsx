import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link,Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import UserTable from '../UserTable';
import Auth from '../../utils/Auth';
import Navbar from '../Navbar';
import PaymentPage from '../PaymentPage';
import FormHistory from './FormHistory';


const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [forms, setForms] = useState([]);
  const [admin, setAdmin] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFormId, setSelectedFormId] = useState(null);

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
  const handleFormSelect = (formId) => {
    setSelectedFormId(formId);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  let closureRate = 0;
  if (forms.length > 0) {
    closureRate = (forms.filter(form => form.status === 'closed').length / forms.length) * 100;
    console.log(closureRate);
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


      {/*
      
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

      <div className="bg-white rounded-lg shadow-lg p-6 bg-indigo-500"> 
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">Total Forms</h3>
          <i className="fas fa-chart-line fa-2x text-white opacity-75"></i> 
        </div>
        <p className="text-3xl font-bold text-white">10</p>
      </div>

      
      */}
         {/* Display Admin Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-yellow-500 rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800">Total Users</h3>
            <i className="fas fa-users fa-2x text-gray-800 opacity-75"></i>
          </div>
          <p className="text-3xl font-bold text-gray-800">{users.length}</p>
        </div>
        <div className="bg-blue-500 rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800">Total Forms</h3>
            <i className="fas fa-file-alt fa-2x text-gray-800 opacity-75"></i>
          </div>
          <p className="text-3xl font-bold text-gray-800">{forms.length}</p>
        </div>
        <div className="shadow-md bg-green-500 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800">Closure Rate</h3>
            <i className="fas fa-chart-line fa-2x text-gray-800 opacity-75"></i>
            </div>
          <p className="text-3xl font-bold text-gray-800">{closureRate}</p>
          </div>


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

      {/* Forms submitted by users of the admin */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 ">
      <h2 className="text-xl font-bold mb-2">History</h2>
        <div className=" justify-between items-center overflow-x-scroll">

            <FormHistory />
            </div>
            <h2 className="text-xl font-bold mb-2 mt-10">Forms</h2>
            <div className=" justify-between items-center overflow-x-scroll">


        {/* Forms Table */}
        <table className="table-auto w-full mb-4 bg-white shadow-md overflow-x-scroll">
          <thead>
            <tr>
              <th className="border px-4 py-2">Num</th>  
              <th className="border px-4 py-2">Form Id</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {forms.map(form => (
              <tr key={form._id}>
                <td className="border px-4 py-2">{form.numId}</td>
                <td className="border px-4 py-2">{form._id}</td>
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
    </div>
    </>
  );
}
};

export default AdminDashboard;
