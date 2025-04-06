import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/ Login';
import Register from './pages/Register';
import AdminRegister from './pages/AdminRegiter';
import AlumniHome from './pages/AlumniHome';
import AdminHome from './pages/AlumniHome';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { isAuthenticated } from './services/auth';
import './styles/global.css';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={
            isAuthenticated() ? <Navigate to="/dashboard" /> : <Login />
          } />
          <Route path="/register" element={
            isAuthenticated() ? <Navigate to="/dashboard" /> : <Register />
          } />
          <Route path="/admin-register" element={
            isAuthenticated() ? <Navigate to="/dashboard" /> : <AdminRegister />
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

// Dashboard component decides which home to show based on user role
const Dashboard: React.FC = () => {
  // We'd typically get the user from a context or API call
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (user.is_college_admin) {
    return <AdminHome />;
  }
  
  return <AlumniHome />;
};

export default App;