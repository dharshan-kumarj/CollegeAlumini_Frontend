import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login({ username: formData.username, password: formData.password });
      navigate('/'); // Redirect after successful login
    } catch (err) {
      setError('Invalid username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-5">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card bg-dark shadow-lg border-0">
              <div className="card-body p-4 p-sm-5">
                <div className="text-center mb-4">
                  <i className="bi bi-mortarboard-fill text-primary fs-1 mb-2"></i>
                  <h2 className="fw-bold text-white">Welcome Back</h2>
                  <p className="text-muted">Sign in to continue to your alumni dashboard</p>
                </div>
              
                {error && (
                  <div className="alert alert-danger" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                  </div>
                )}
              
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label text-light">Username</label>
                    <div className="input-group">
                      <span className="input-group-text bg-dark-subtle border-secondary">
                        <i className="bi bi-person"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        id="username"
                        name="username"
                        placeholder="Enter your username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <label htmlFor="password" className="form-label text-light">Password</label>
                      <Link to="/forgot-password" className="text-decoration-none small text-primary">Forgot password?</Link>
                    </div>
                    <div className="input-group">
                      <span className="input-group-text bg-dark-subtle border-secondary">
                        <i className="bi bi-lock"></i>
                      </span>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="d-grid mb-4">
                    <button 
                      type="submit" 
                      className="btn btn-primary py-2"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Signing in...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-box-arrow-in-right me-2"></i>
                          Sign In
                        </>
                      )}
                    </button>
                  </div>
                </form>
                
                <div className="text-center">
                  <p className="mb-0 text-muted">
                    Don't have an account? <Link to="/register" className="text-decoration-none text-primary">Register now</Link>
                  </p>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-4">
              <Link to="/" className="text-decoration-none text-muted">
                <i className="bi bi-arrow-left me-1"></i> Back to Homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;