import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AlumniProfile from './pages/alumni/AlumniProfile';
import AlumniList from './pages/admin/AlumniList';
import AdminAlumniDetail from './pages/admin/AdminAlumniDetail';
import NotFound from './pages/NotFound';
import './App.css';

// Protected route for alumni only
const AlumniRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (!user?.is_alumni) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

// Protected route for admin only
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (user?.is_alumni) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

// Route that redirects authenticated users away (for login/register pages)
const UnauthenticatedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  
  if (isAuthenticated) {
    if (user?.is_alumni) {
      return <Navigate to="/profile" />;
    } else {
      return <Navigate to="/admin/dashboard" />;
    }
  }
  
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      
      {/* Auth Routes */}
      <Route 
        path="/login" 
        element={
          <UnauthenticatedRoute>
            <Login />
          </UnauthenticatedRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <UnauthenticatedRoute>
            <Register />
          </UnauthenticatedRoute>
        } 
      />
      
      {/* Alumni Routes */}
      <Route 
        path="/profile" 
        element={
          <AlumniRoute>
            <AlumniProfile />
          </AlumniRoute>
        } 
      />
      
      {/* Admin Routes */}
      <Route 
        path="/admin/alumni" 
        element={
          <AdminRoute>
            <AlumniList />
          </AdminRoute>
        } 
      />
      <Route 
        path="/admin/alumni/:id" 
        element={
          <AdminRoute>
            <AdminAlumniDetail />
          </AdminRoute>
        } 
      />
      
      {/* Fallback route - 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="d-flex flex-column min-vh-100 bg-dark text-light">
        <Navigation />
        <main className="flex-grow-1 d-flex flex-column">
          <AppRoutes />
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
};

export default App;
