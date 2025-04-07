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
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          <i className="bi bi-mortarboard-fill me-2"></i>
          College Alumni Network
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/"><i className="bi bi-house-door me-1"></i> Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/events"><i className="bi bi-calendar-event me-1"></i> Events</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/directory"><i className="bi bi-people me-1"></i> Directory</Link>
            </li>
            {isAuthenticated && user?.is_alumni && (
              <li className="nav-item">
                <Link className="nav-link" to="/profile"><i className="bi bi-person-badge me-1"></i> My Profile</Link>
              </li>
            )}
            {isAuthenticated && !user?.is_alumni && (
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i className="bi bi-gear me-1"></i> Admin
                </a>
                <ul className="dropdown-menu dropdown-menu-dark">
                  <li><Link className="dropdown-item" to="/admin/alumni">Manage Alumni</Link></li>
                  <li><Link className="dropdown-item" to="/admin/events">Manage Events</Link></li>
                  <li><Link className="dropdown-item" to="/admin/reports">Reports</Link></li>
                </ul>
              </li>
            )}
          </ul>
          <div className="d-flex">
            {isAuthenticated ? (
              <div className="dropdown">
                <button className="btn btn-outline-light dropdown-toggle d-flex align-items-center" type="button" id="userMenu" data-bs-toggle="dropdown" aria-expanded="false">
                  <i className="bi bi-person-circle me-1"></i>
                  <span className="me-1">{user?.username}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end">
                  {user?.is_alumni && (
                    <li><Link className="dropdown-item" to="/profile"><i className="bi bi-person me-2"></i>My Profile</Link></li>
                  )}
                  <li><Link className="dropdown-item" to="/settings"><i className="bi bi-gear me-2"></i>Settings</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className="dropdown-item" onClick={handleLogout}><i className="bi bi-box-arrow-right me-2"></i>Logout</button></li>
                </ul>
              </div>
            ) : (
              <div>
                <Link to="/login" className="btn btn-outline-light me-2"><i className="bi bi-box-arrow-in-right me-1"></i>Login</Link>
                <Link to="/register" className="btn btn-primary"><i className="bi bi-person-plus me-1"></i>Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;