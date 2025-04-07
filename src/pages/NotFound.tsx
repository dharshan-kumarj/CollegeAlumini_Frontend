import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 text-center">
          <div className="mb-4">
            <h1 className="display-1 fw-bold text-primary">404</h1>
            <h2 className="fs-1 text-white mb-3">Page Not Found</h2>
            <p className="lead text-muted mb-5">
              The page you are looking for doesn't exist or has been moved.
            </p>
            <div className="d-flex justify-content-center gap-3">
              <Link to="/" className="btn btn-primary px-4 py-2">
                <i className="bi bi-house-door me-2"></i>
                Return Home
              </Link>
              <button 
                onClick={() => window.history.back()} 
                className="btn btn-outline-light px-4 py-2"
              >
                <i className="bi bi-arrow-left me-2"></i>
                Go Back
              </button>
            </div>
          </div>
          
          <div className="card bg-dark border-0 shadow mt-5">
            <div className="card-body p-4">
              <h3 className="h5 text-white mb-3">Looking for something?</h3>
              <p className="text-muted mb-4">Try these useful links:</p>
              <div className="row g-3">
                <div className="col-sm-6">
                  <Link to="/events" className="text-decoration-none d-block p-3 rounded bg-black bg-opacity-50 text-white hover-lift">
                    <i className="bi bi-calendar-event me-2 text-primary"></i>
                    Upcoming Events
                  </Link>
                </div>
                <div className="col-sm-6">
                  <Link to="/directory" className="text-decoration-none d-block p-3 rounded bg-black bg-opacity-50 text-white hover-lift">
                    <i className="bi bi-people me-2 text-primary"></i>
                    Alumni Directory
                  </Link>
                </div>
                <div className="col-sm-6">
                  <Link to="/login" className="text-decoration-none d-block p-3 rounded bg-black bg-opacity-50 text-white hover-lift">
                    <i className="bi bi-box-arrow-in-right me-2 text-primary"></i>
                    Sign In
                  </Link>
                </div>
                <div className="col-sm-6">
                  <Link to="/register" className="text-decoration-none d-block p-3 rounded bg-black bg-opacity-50 text-white hover-lift">
                    <i className="bi bi-person-plus me-2 text-primary"></i>
                    Join Alumni Network
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;