import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const AdminRegister: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    first_name: '',
    last_name: '',
    admin_code: '', // For admin authorization
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      // We'll create the admin user through the regular register endpoint
      // In a real application, you would have a separate endpoint or parameter for admin registration
      const registerData = {
        email: formData.email,
        username: formData.username,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name
        // Exclude the admin_code from the API request
      };
      
      // In a real application, you would verify the admin code first
      if (formData.admin_code !== 'your-secret-admin-code') { // Replace with actual verification
        setError('Invalid admin authorization code');
        setLoading(false);
        return;
      }

      // Send the registration request
      const response = await axios.post('/api/v1/auth/register', registerData);
      
      // After registration, you might need to update the user role to admin
      // This would typically be done through a separate endpoint
      // For example: await axios.post('/api/v1/users/{user_id}/make-admin', { user_id: response.data.id });

      setSuccess(true);
      // Clear form data
      setFormData({
        email: '',
        username: '',
        password: '',
        first_name: '',
        last_name: '',
        admin_code: '',
      });
      
      // Optionally redirect after a delay
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="page-title">Register College Administrator</h2>
      
      {error && <div className="alert alert-error">{error}</div>}
      {success && (
        <div className="alert alert-success">
          Admin user registered successfully! You'll be redirected to login page.
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email*</label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-input"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="username" className="form-label">Username*</label>
          <input
            type="text"
            id="username"
            name="username"
            className="form-input"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password" className="form-label">Password*</label>
          <input
            type="password"
            id="password"
            name="password"
            className="form-input"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="first_name" className="form-label">First Name</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            className="form-input"
            value={formData.first_name}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="last_name" className="form-label">Last Name</label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            className="form-input"
            value={formData.last_name}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="admin_code" className="form-label">Admin Authorization Code*</label>
          <input
            type="password"
            id="admin_code"
            name="admin_code"
            className="form-input"
            value={formData.admin_code}
            onChange={handleChange}
            required
          />
          <small style={{ display: 'block', marginTop: '5px', color: '#666' }}>
            Enter the administrator authorization code provided by system maintainer
          </small>
        </div>
        
        <div className="form-group">
          <button
            type="submit"
            className="btn btn-full"
            disabled={loading}
            style={{ backgroundColor: '#9c27b0' }} // Different color for admin actions
          >
            {loading ? 'Registering...' : 'Register Administrator'}
          </button>
        </div>
      </form>
      
      <div className="form-footer">
        <p>Already have an account? <Link to="/login">Login here</Link></p>
        <p>Register as alumni? <Link to="/register">Register here</Link></p>
      </div>
    </div>
  );
};

export default AdminRegister;