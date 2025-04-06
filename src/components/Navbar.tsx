import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { logout, isAuthenticated } from '../services/auth';

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = isAuthenticated();
  
  const user = isActive ? JSON.parse(localStorage.getItem('user') || '{}') : null;
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-brand">
          <h2>Alumni Connect</h2>
        </Link>
        
        <div className="navbar-links">
          {isActive ? (
            <>
              <span className="navbar-greeting">
                Hello, {user?.first_name || user?.username}
              </span>
              <Link 
                to="/dashboard" 
                className={`navbar-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
              >
                Dashboard
              </Link>
              <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className={`navbar-link ${location.pathname === '/login' ? 'active' : ''}`}
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className={`navbar-link ${location.pathname === '/register' ? 'active' : ''}`}
              >
                Register
              </Link>
            </>
          )}
          
          <button 
            onClick={toggleTheme} 
            className="theme-switch"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;