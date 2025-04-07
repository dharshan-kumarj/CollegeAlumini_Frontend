import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6 mb-3 mb-md-0">
            <h5 className="text-primary mb-0 fw-bold">
              <i className="bi bi-mortarboard-fill me-2"></i>
              College Alumni Network
            </h5>
          </div>
          
          <div className="col-md-6">
            <div className="d-flex justify-content-md-end justify-content-center">
              <a href="#" className="text-decoration-none me-3 social-icon">
                <i className="bi bi-facebook text-muted fs-5"></i>
              </a>
              <a href="#" className="text-decoration-none me-3 social-icon">
                <i className="bi bi-twitter text-muted fs-5"></i>
              </a>
              <a href="#" className="text-decoration-none me-3 social-icon">
                <i className="bi bi-linkedin text-muted fs-5"></i>
              </a>
              <a href="#" className="text-decoration-none social-icon">
                <i className="bi bi-instagram text-muted fs-5"></i>
              </a>
            </div>
          </div>
        </div>
        
        <hr className="my-3 bg-secondary" />
        
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
          <p className="mb-3 mb-md-0 text-muted small">
            © {currentYear} College Alumni Network. All rights reserved. <span className="text-primary">Developed by Dharshan Kumar</span>
          </p>
          <div className="d-flex gap-3">
            <Link to="/privacy" className="text-decoration-none text-muted small">Privacy Policy</Link>
            <Link to="/terms" className="text-decoration-none text-muted small">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;