import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navigation: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">College Alumni System</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            {isAuthenticated && user?.is_alumni && (
              <li className="nav-item">
                <Link className="nav-link" to="/profile">My Profile</Link>
              </li>
            )}
            {isAuthenticated && !user?.is_alumni && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/alumni">Manage Alumni</Link>
                </li>
              </>
            )}
          </ul>
          <div className="d-flex">
            {isAuthenticated ? (
              <div className="dropdown">
                <button className="btn btn-light dropdown-toggle" type="button" id="userMenu" data-bs-toggle="dropdown">
                  {user?.username}
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  {user?.is_alumni && (
                    <li><Link className="dropdown-item" to="/profile">My Profile</Link></li>
                  )}
                  <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                </ul>
              </div>
            ) : (
              <div>
                <Link to="/login" className="btn btn-light me-2">Login</Link>
                <Link to="/register" className="btn btn-outline-light">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;