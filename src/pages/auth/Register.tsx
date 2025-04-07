import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Education } from '../../types';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { registerAlumni, registerAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAlumni, setIsAlumni] = useState(true);

  // Common fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  
  // Alumni specific fields
  const [fullName, setFullName] = useState('');
  const [education, setEducation] = useState<Education>({
    degree: '',
    department: '',
    institution: 'Our College',
    start_year: new Date().getFullYear() - 4,
    end_year: new Date().getFullYear(),
  });
  
  // Admin specific fields
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (isAlumni) {
        await registerAlumni({
          username,
          password,
          email,
          is_alumni: true,
          full_name: fullName,
          education
        });
      } else {
        await registerAdmin({
          username,
          password,
          email,
          is_alumni: false,
          department,
          designation
        });
      }
      navigate('/');
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">Register</h2>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <div className="mb-4 d-flex justify-content-center">
                <div className="btn-group" role="group">
                  <button
                    type="button"
                    className={`btn ${isAlumni ? 'btn-black  text-white' : 'btn-outline-black'}`}
                    onClick={() => setIsAlumni(true)}
                  >
                    Register as Alumni
                  </button>
                  <button
                    type="button"
                    className={`btn ${!isAlumni ? 'btn-black  text-white' : 'btn-outline-black'}`}
                    onClick={() => setIsAlumni(false)}
                  >
                    Register as Admin
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Common Fields */}
                <div className="row mb-3">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Alumni-specific fields */}
                {isAlumni && (
                  <>
                    <div className="mb-3">
                      <label htmlFor="fullName" className="form-label">Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                    </div>
                    
                    <h5 className="mt-4 mb-3">Education Details</h5>
                    <div className="row mb-3">
                      <div className="col-md-6 mb-3 mb-md-0">
                        <label htmlFor="degree" className="form-label">Degree</label>
                        <input
                          type="text"
                          className="form-control"
                          id="degree"
                          value={education.degree}
                          onChange={(e) => setEducation({...education, degree: e.target.value})}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="department" className="form-label">Department</label>
                        <input
                          type="text"
                          className="form-control"
                          id="department"
                          value={education.department}
                          onChange={(e) => setEducation({...education, department: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="row mb-3">
                      <div className="col-md-6 mb-3 mb-md-0">
                        <label htmlFor="startYear" className="form-label">Start Year</label>
                        <input
                          type="number"
                          className="form-control"
                          id="startYear"
                          value={education.start_year}
                          onChange={(e) => setEducation({...education, start_year: Number(e.target.value)})}
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <label htmlFor="endYear" className="form-label">End Year</label>
                        <input
                          type="number"
                          className="form-control"
                          id="endYear"
                          value={education.end_year}
                          onChange={(e) => setEducation({...education, end_year: Number(e.target.value)})}
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Admin-specific fields */}
                {!isAlumni && (
                  <>
                    <div className="mb-3">
                      <label htmlFor="department" className="form-label">Department</label>
                      <input
                        type="text"
                        className="form-control"
                        id="department"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="designation" className="form-label">Designation</label>
                      <input
                        type="text"
                        className="form-control"
                        id="designation"
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        required
                      />
                    </div>
                  </>
                )}

                <div className="d-grid gap-2 mt-4">
                  <button 
                    type="submit" 
                    className="btn btn-black text-white" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Registering...' : 'Register'}
                  </button>
                </div>
              </form>
              
              <div className="mt-3 text-center">
                <p>Already have an account? <a href="/login">Login</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;