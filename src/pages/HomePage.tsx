import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  
  return (
    <div>
      {/* Hero Section */}
      <div className="bg-primary text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-3">College Alumni Network</h1>
              <p className="lead mb-4">
                Connect with former classmates, find mentorship opportunities, and stay updated with your alma mater.
              </p>
              
              {!isAuthenticated && (
                <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                  <Link to="/register" className="btn btn-light btn-lg px-4 me-md-2">
                    Join Now
                  </Link>
                  <Link to="/login" className="btn btn-outline-light btn-lg px-4">
                    Sign In
                  </Link>
                </div>
              )}
              
              {isAuthenticated && user?.is_alumni && (
                <Link to="/profile" className="btn btn-light btn-lg px-4">
                  View My Profile
                </Link>
              )}
              
              {isAuthenticated && !user?.is_alumni && (
                <Link to="/admin/dashboard" className="btn btn-light btn-lg px-4">
                  Go to Dashboard
                </Link>
              )}
            </div>
            
            <div className="col-lg-6 d-none d-lg-block">
              <img 
                src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80" 
                alt="College graduation" 
                className="img-fluid rounded-3"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-5 bg-light">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="feature-icon bg-primary bg-gradient text-white mb-3 mx-auto rounded-circle d-flex align-items-center justify-content-center" 
                    style={{ width: '70px', height: '70px' }}>
                    <i className="bi bi-people-fill fs-2"></i>
                  </div>
                  <h3 className="fs-4 fw-bold">Connect</h3>
                  <p className="mb-0">
                    Find and reconnect with former classmates, professors, and friends from your time at college.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="feature-icon bg-primary bg-gradient text-white mb-3 mx-auto rounded-circle d-flex align-items-center justify-content-center" 
                    style={{ width: '70px', height: '70px' }}>
                    <i className="bi bi-briefcase-fill fs-2"></i>
                  </div>
                  <h3 className="fs-4 fw-bold">Career Growth</h3>
                  <p className="mb-0">
                    Find mentorship opportunities, job postings, and career advice from successful alumni.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="feature-icon bg-primary bg-gradient text-white mb-3 mx-auto rounded-circle d-flex align-items-center justify-content-center" 
                    style={{ width: '70px', height: '70px' }}>
                    <i className="bi bi-calendar-event fs-2"></i>
                  </div>
                  <h3 className="fs-4 fw-bold">Events</h3>
                  <p className="mb-0">
                    Stay updated with college events, reunions, and alumni gatherings in your area.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Section */}
      <div className="py-5">
        <div className="container">
          <div className="row justify-content-center text-center mb-5">
            <div className="col-lg-8">
              <h2 className="fw-bold mb-3">Join Our Growing Community</h2>
              <p className="lead text-muted">
                Our alumni network continues to grow, providing more opportunities for connection and growth.
              </p>
            </div>
          </div>
          
          <div className="row g-4 text-center">
            <div className="col-md-4">
              <h2 className="display-4 fw-bold text-primary">5000+</h2>
              <p className="text-muted">Registered Alumni</p>
            </div>
            
            <div className="col-md-4">
              <h2 className="display-4 fw-bold text-primary">120+</h2>
              <p className="text-muted">Countries Represented</p>
            </div>
            
            <div className="col-md-4">
              <h2 className="display-4 fw-bold text-primary">250+</h2>
              <p className="text-muted">Companies Connected</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-primary text-white py-5">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h2 className="fw-bold mb-3">Ready to Connect?</h2>
              <p className="lead mb-4">
                Join our alumni network today and reconnect with your college community.
              </p>
              
              {!isAuthenticated ? (
                <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
                  <Link to="/register" className="btn btn-light btn-lg px-4 gap-3">
                    Get Started
                  </Link>
                </div>
              ) : (
                <p className="fs-5">
                  Thank you for being part of our community!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;