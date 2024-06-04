
import React, { useState, useEffect } from 'react';
import axios from 'axios';


const Dashboard = ({role}) => {
    const [client, setClient] = useState(null);
    const [users, setUsers] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [superadmins, setSuperadmins] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('token'));
    useEffect(() => {


        const fetchUsers = async () => {
            try {
                const response = await axios.get('/user',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                setUsers(response.data);
            } catch (err) {
                console.error('Error fetching users:', err);
            }
        };

        const fetchAdmins = async () => {
            try {
                const response = await axios.get('/admin',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setAdmins(response.data);
            } catch (err) {
                console.error('Error fetching admins:', err);
            }
        };

        const fetchSuperadmins = async () => {
            try {
                const response = await axios.get('/superadmin');
                setSuperadmins(response.data);
            } catch (err) {
                console.error('Error fetching superadmins:', err);
            }
        };

        fetchUsers();
        fetchAdmins();
        fetchSuperadmins();
    }
    , []);

    let content = null;

    if (role === 'user') {
        content = (
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">User Dashboard</h2>
                <p>Welcome, {client && client.name}!</p>
                <p>Your email: {client && client.email}</p>
            </div>
        );
    }

    if (role === 'admin') {
        content = (
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h2>
                <p>Welcome, {client && client.name}!</p>
                <p>Your email: {client && client.email}</p>
                <h3>Users</h3>
                <ul>
                    {users.map(user => (
                        <li key={user._id}>{user.name}</li>
                    ))}
                </ul>
            </div>
        );
    }

    if (role === 'superadmin') {
        content = (
            <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Superadmin Dashboard</h2>
                <p>Welcome, {client && client.name}!</p>
                <p>Your email: {client && client.email}</p>
                <h3>Admins</h3>
                <ul>
                    {admins.map(admin => (
                        <li key={admin._id}>{admin.name}</li>
                    ))}
                </ul>
                <h3>Superadmins</h3>
                <ul>
                    {superadmins.map(superadmin => (
                        <li key={superadmin._id}>{superadmin.name}</li>
                    ))}
                </ul>
            </div>
        );
    }


    



    return (
        <div>
            {content}
        </div>
    );
}

export default Dashboard;
