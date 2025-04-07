import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  
  return (
    <div className="bg-dark text-light">
      {/* Hero Section */}
      <div className="bg-dark position-relative overflow-hidden">
        <div className="position-absolute w-100 h-100 top-0" style={{ 
          background: 'linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.4) 100%)'
        }}></div>
        <div className="container py-5 position-relative" style={{ zIndex: 2 }}>
          <div className="row align-items-center min-vh-75" style={{ minHeight: '550px' }}>
            <div className="col-lg-6">
              <span className="badge bg-primary text-white px-3 py-2 mb-3">Est. 1975</span>
              <h1 className="display-3 fw-bold mb-3 text-white">College Alumni Network</h1>
              <p className="lead mb-4 text-light fs-4">
                Connect with former classmates, find mentorship opportunities, and stay updated with your alma mater.
              </p>
              
              {!isAuthenticated && (
                <div className="d-grid gap-3 d-md-flex justify-content-md-start">
                  <Link to="/register" className="btn btn-primary btn-lg px-4 me-md-2 fw-medium">
                    <i className="bi bi-person-plus me-2"></i>Join Now
                  </Link>
                  <Link to="/login" className="btn btn-outline-light btn-lg px-4 fw-medium">
                    <i className="bi bi-box-arrow-in-right me-2"></i>Sign In
                  </Link>
                </div>
              )}
              
              {isAuthenticated && user?.is_alumni && (
                <Link to="/profile" className="btn btn-primary btn-lg px-4 fw-medium">
                  <i className="bi bi-person-badge me-2"></i>View My Profile
                </Link>
              )}
              
              {isAuthenticated && !user?.is_alumni && (
                <Link to="/admin/alumni" className="btn btn-primary btn-lg px-4 fw-medium">
                  <i className="bi bi-speedometer2 me-2"></i>Go to Dashboard
                </Link>
              )}
            </div>
            
            <div className="col-lg-6 d-none d-lg-block">
              <div className="position-relative">
                <div className="position-absolute rounded-circle bg-primary opacity-25" 
                  style={{ width: '350px', height: '350px', top: '-3rem', right: '-3rem', zIndex: 0 }}></div>
                <img 
                  src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80" 
                  alt="College graduation" 
                  className="img-fluid rounded-3 shadow-lg border border-secondary"
                  style={{ zIndex: 1, position: 'relative' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-5 bg-black">
        <div className="container py-4">
          <div className="row justify-content-center mb-5">
            <div className="col-lg-7 text-center">
              <h6 className="text-primary fw-bold mb-2 text-uppercase tracking-wider">Why Join Us</h6>
              <h2 className="display-5 fw-bold text-white mb-3">Features & Benefits</h2>
              <p className="lead text-muted">Our network provides valuable resources and connections to help you thrive professionally and personally.</p>
            </div>
          </div>
          
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow bg-dark text-light">
                <div className="card-body p-4">
                  <div className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 rounded-circle p-3 mb-3">
                    <i className="bi bi-people-fill text-primary fs-2"></i>
                  </div>
                  <h3 className="fs-4 fw-bold text-white">Connect With Alumni</h3>
                  <p className="text-muted mb-0">
                    Find and reconnect with former classmates, professors, and friends from your time at college.
                  </p>
                  <div className="mt-3">
                    <Link to="/directory" className="btn btn-link text-primary p-0">
                      Browse Directory <i className="bi bi-arrow-right ms-1"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow bg-dark text-light">
                <div className="card-body p-4">
                  <div className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 rounded-circle p-3 mb-3">
                    <i className="bi bi-briefcase-fill text-primary fs-2"></i>
                  </div>
                  <h3 className="fs-4 fw-bold text-white">Career Growth</h3>
                  <p className="text-muted mb-0">
                    Find mentorship opportunities, job postings, and career advice from successful alumni.
                  </p>
                  <div className="mt-3">
                    <Link to="/career" className="btn btn-link text-primary p-0">
                      Explore Opportunities <i className="bi bi-arrow-right ms-1"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow bg-dark text-light">
                <div className="card-body p-4">
                  <div className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 rounded-circle p-3 mb-3">
                    <i className="bi bi-calendar-event text-primary fs-2"></i>
                  </div>
                  <h3 className="fs-4 fw-bold text-white">Events & Meetups</h3>
                  <p className="text-muted mb-0">
                    Stay updated with college events, reunions, and alumni gatherings in your area.
                  </p>
                  <div className="mt-3">
                    <Link to="/events" className="btn btn-link text-primary p-0">
                      View Calendar <i className="bi bi-arrow-right ms-1"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Section */}
      <div className="py-5 bg-dark">
        <div className="container py-4">
          <div className="row justify-content-center text-center mb-5">
            <div className="col-lg-8">
              <h6 className="text-primary fw-bold mb-2 text-uppercase">Our Impact</h6>
              <h2 className="display-5 fw-bold text-white mb-3">Join Our Growing Community</h2>
              <p className="lead text-muted">
                Our alumni network continues to grow, providing more opportunities for connection and growth.
              </p>
            </div>
          </div>
          
          <div className="row g-4 text-center">
            <div className="col-md-4">
              <div className="bg-black bg-opacity-50 rounded-3 p-4 border border-secondary border-opacity-25">
                <h2 className="display-3 fw-bold text-primary mb-1">5000+</h2>
                <p className="text-muted mb-0 fs-5">Registered Alumni</p>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="bg-black bg-opacity-50 rounded-3 p-4 border border-secondary border-opacity-25">
                <h2 className="display-3 fw-bold text-primary mb-1">120+</h2>
                <p className="text-muted mb-0 fs-5">Countries Represented</p>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="bg-black bg-opacity-50 rounded-3 p-4 border border-secondary border-opacity-25">
                <h2 className="display-3 fw-bold text-primary mb-1">250+</h2>
                <p className="text-muted mb-0 fs-5">Companies Connected</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Testimonial Section */}
      <div className="py-5 bg-black">
        <div className="container py-4">
          <div className="row justify-content-center mb-5">
            <div className="col-lg-7 text-center">
              <h6 className="text-primary fw-bold mb-2 text-uppercase">Testimonials</h6>
              <h2 className="display-5 fw-bold text-white mb-3">What Our Alumni Say</h2>
            </div>
          </div>
          
          <div className="row g-4">
            <div className="col-lg-4">
              <div className="card bg-dark border-0 shadow h-100">
                <div className="card-body p-4">
                  <div className="d-flex mb-3">
                    {[1,2,3,4,5].map(star => (
                      <i key={star} className="bi bi-star-fill text-warning me-1"></i>
                    ))}
                  </div>
                  <p className="text-muted mb-3">"Connecting with the alumni network helped me secure my dream job. The mentorship I received was invaluable for my career growth."</p>
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3" style={{width: '40px', height: '40px'}}>
                      <span className="fw-bold">JD</span>
                    </div>
                    <div>
                      <h6 className="mb-0 text-white">John Doe</h6>
                      <small className="text-muted">Class of 2018</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-lg-4">
              <div className="card bg-dark border-0 shadow h-100">
                <div className="card-body p-4">
                  <div className="d-flex mb-3">
                    {[1,2,3,4,5].map(star => (
                      <i key={star} className="bi bi-star-fill text-warning me-1"></i>
                    ))}
                  </div>
                  <p className="text-muted mb-3">"The alumni events have been fantastic for networking. I've met so many inspiring professionals who started just like me."</p>
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3" style={{width: '40px', height: '40px'}}>
                      <span className="fw-bold">JS</span>
                    </div>
                    <div>
                      <h6 className="mb-0 text-white">Jane Smith</h6>
                      <small className="text-muted">Class of 2015</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-lg-4">
              <div className="card bg-dark border-0 shadow h-100">
                <div className="card-body p-4">
                  <div className="d-flex mb-3">
                    {[1,2,3,4,5].map(star => (
                      <i key={star} className="bi bi-star-fill text-warning me-1"></i>
                    ))}
                  </div>
                  <p className="text-muted mb-3">"Being part of this alumni network has given me opportunities to give back to my alma mater and help the next generation succeed."</p>
                  <div className="d-flex align-items-center">
                    <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3" style={{width: '40px', height: '40px'}}>
                      <span className="fw-bold">RJ</span>
                    </div>
                    <div>
                      <h6 className="mb-0 text-white">Robert Johnson</h6>
                      <small className="text-muted">Class of 2010</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="py-5 bg-primary">
        <div className="container py-4">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h2 className="display-5 fw-bold mb-3 text-white">Ready to Connect?</h2>
              <p className="lead mb-4 text-white fs-5">
                Join our alumni network today and reconnect with your college community.
              </p>
              
              {!isAuthenticated ? (
                <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
                  <Link to="/register" className="btn btn-light btn-lg px-5 py-3 gap-3 fw-medium">
                    <i className="bi bi-person-plus me-2"></i>Join The Network
                  </Link>
                </div>
              ) : (
                <p className="fs-4 text-white">
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