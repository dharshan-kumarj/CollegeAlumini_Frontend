import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-dark text-white py-4 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-4 mb-md-0">
            <h5>College Alumni System</h5>
            <p className="text-muted">
              Connect with former classmates, find mentorship opportunities, and stay updated with your alma mater.
            </p>
          </div>
          
          <div className="col-md-4 mb-4 mb-md-0">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-decoration-none text-muted">Home</Link>
              </li>
              <li className="mb-2">
                <Link to="/login" className="text-decoration-none text-muted">Login</Link>
              </li>
              <li className="mb-2">
                <Link to="/register" className="text-decoration-none text-muted">Register</Link>
              </li>
            </ul>
          </div>
          
          <div className="col-md-4">
            <h5>Contact</h5>
            <address className="text-muted">
              <p>University Campus</p>
              <p>123 Education Street</p>
              <p>Email: alumni@university.edu</p>
              <p>Phone: +1 234 567 8900</p>
            </address>
          </div>
        </div>
        
        <hr className="my-4 bg-secondary" />
        
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
          <p className="mb-3 mb-md-0 text-muted">
            © {currentYear} College Alumni System. All rights reserved.
          </p>
          <div className="d-flex">
            <a href="#" className="text-muted me-3">
              <i className="bi bi-facebook"></i>
            </a>
            <a href="#" className="text-muted me-3">
              <i className="bi bi-twitter"></i>
            </a>
            <a href="#" className="text-muted me-3">
              <i className="bi bi-linkedin"></i>
            </a>
            <a href="#" className="text-muted">
              <i className="bi bi-instagram"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;