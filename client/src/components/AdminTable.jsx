import React from 'react';
import { Link } from 'react-router-dom';



const AdminTable = ({ users }) => {

  return (
    <div className="overflow-x-auto">
    <table className="w-full table-auto mt-4" >
      <thead>
        <tr>
          <th className="px-4 py-2 text-left text-gray-700 font-bold text-center">Name</th>
          <th className="px-4 py-2 text-left text-gray-700 font-bold text-center">Email</th>
          <th className="px-4 py-2 text-left text-gray-700 font-bold text-center">Business</th>
          <th className="px-4 py-2 text-left text-gray-700 font-bold text-center">Phone</th>
          <th className="px-4 py-2 text-left text-gray-700 font-bold text-center">Paid</th>
          <th className="px-4 py-2 text-left text-gray-700 font-bold text-center">Payment Type</th>

          <th className="px-4 py-2 text-left text-gray-700 font-bold text-center">Actions</th>
          
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user._id}>
            <td className="px-4 py-2 text-gray-700">{user.firstName +' '+ user.lastName}</td>
            <td className="px-4 py-2 text-gray-700">{user.email}</td>
            <td className="px-4 py-2 text-gray-700">{user.businessName}</td>
            <td className="px-4 py-2 text-gray-700">{user.phone}</td>
            <td className="px-4 py-2 text-gray-700">{user.isPaid ? 
              <span className="bg-green-500 text-white font-bold py-1 px-2 rounded">Paid</span> : 
              <span className="bg-red-500 text-white font-bold py-1 px-2 rounded">No</span>}
            </td>
            <td className="px-4 py-2 text-gray-700">{user.paymentType && user.isPaid ? user.paymentType : ''
            
            }</td>


            <td className="px-4 py-2 text-gray-700">
              <Link to={`/superadmin/admins/${user._id}/edit`} className="text-blue-500 hover:text-blue-800 mr-2">
                Edit
              </Link>

            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
};

export default AdminTable;