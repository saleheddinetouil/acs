import React, {  } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; 
import { AuthProvider } from './context/AuthContext'; 
import ProtectedRoute from './components/ProtectedRoute'; 
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import UserDashboard from './components/dashboards/UserDashboard';
import AdminDashboard from './components/dashboards/AdminDashboard';
import SuperAdminDashboard from './components/dashboards/SuperAdminDashboard';
import QMSForm from './components/UserForms/QMSForm';
import SuperAdminAddAdminForm from './components/SuperAdminDashboard/SuperAdminAddAdminForm';
import AdminAddUserForm from './components/AdminDashboard/AdminAddUserForm';
import AdminEditUserForm from './components/AdminDashboard/AdminEditUserForm';
import SuperadminEditAdminForm from './components/SuperAdminDashboard/SuperadminEditAdminForm';
import ProfileEdit from './components/ProfileEdit';
import AdminProfileEdit from './components/AdminProfileEdit';
import SuperAdminProfileEdit from './components/SuperAdminProfileEdit';
import axios from 'axios';

import './App.css';

axios.defaults.baseURL = 'http://localhost:5000';


function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute roles={['user']} />}>
            <Route path="/user" element={<UserDashboard />} />
            <Route path="/profile" element={<ProfileEdit />} />
            <Route path="/user/forms/:formSubmissionId?" element={<QMSForm />} /> 
          </Route>

          <Route element={<ProtectedRoute roles={['admin']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/profile" element={<AdminProfileEdit  />} />
            <Route path="/admin/users/add" element={<AdminAddUserForm />} />
            <Route path="/admin/users/:userId/edit" element={<AdminEditUserForm />} /> 

            {/* Add more admin routes here */}
          </Route>

          <Route element={<ProtectedRoute roles={['superadmin']} />}>
            <Route path="/superadmin" element={<SuperAdminDashboard />} />
            <Route path="/superadmin/profile" element={<SuperAdminProfileEdit />} />
            <Route path="/superadmin/admins/add" element={<SuperAdminAddAdminForm />} />
            <Route path="/superadmin/admins/:adminId/edit" element={<SuperadminEditAdminForm />} /> 
            {/* Add more superadmin routes here */}
          </Route>

          {/* Redirect to home if no match */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;