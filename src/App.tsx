import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/ Login';
import Register from './pages/Register';
import AlumniHome from './pages/AlumniHome';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { isAuthenticated } from './services/auth';

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={
          isAuthenticated() ? <Navigate to="/alumni" /> : <Login />
        } />
        <Route path="/register" element={
          isAuthenticated() ? <Navigate to="/alumni" /> : <Register />
        } />
        <Route path="/alumni" element={
          <ProtectedRoute>
            <AlumniHome />
          </ProtectedRoute>
        } />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;