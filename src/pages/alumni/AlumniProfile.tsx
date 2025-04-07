import React, { useState, useEffect } from 'react';
import { alumni } from '../../services/api';
import { Education, Job } from '../../types';

// Ensure the `ProfileType` includes `full_name` and other required properties
interface ExtendedProfileType {
  full_name: string;
  email?: string;
  education: Education[];
  jobs: Job[];
  bio?: string;
  contact_number?: string;
  current_location?: string;
  availability_for_mentorship: boolean;
  profile_image?: string;
}

import EducationForm from '../../components/alumni/EducationForm';
import JobForm from '../../components/alumni/JobForm';
import ProfileInfoForm from '../../components/alumni/ProfileInfoForm';
import LoadingSpinner from '../../components/LoadingSpinner';
import AlertMessage from '../../components/AlertMessage';

const AlumniProfile: React.FC = () => {
  const [profile, setProfile] = useState<ExtendedProfileType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showEducationForm, setShowEducationForm] = useState<boolean>(false);
  const [showJobForm, setShowJobForm] = useState<boolean>(false);
  const [showProfileForm, setShowProfileForm] = useState<boolean>(false);
  const [selectedEducation, setSelectedEducation] = useState<Education | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await alumni.getProfile();
      console.log('API Profile response:', response.data);
      setProfile(response.data);
      setError(null);
    } catch (err) {
      console.error('Profile fetch error:', err);
      setError('Failed to load profile data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleProfileUpdate = async (data: Partial<ExtendedProfileType>) => {
    try {
      await alumni.updateProfile(data);
      await fetchProfile();
      setShowProfileForm(false);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    }
  };

  const handleAddEducation = async (education: Omit<Education, 'id'>) => {
    try {
      await alumni.addEducation(education);
      await fetchProfile();
      setShowEducationForm(false);
    } catch (err) {
      setError('Failed to add education. Please try again.');
    }
  };

  const handleDeleteEducation = async (id: string) => {
    try {
      await alumni.deleteEducation(id);
      await fetchProfile();
    } catch (err) {
      setError('Failed to delete education. Please try again.');
    }
  };

  const handleAddJob = async (job: Omit<Job, 'id'>) => {
    try {
      await alumni.addJob(job);
      await fetchProfile();
      setShowJobForm(false);
    } catch (err) {
      setError('Failed to add job. Please try again.');
    }
  };

  const handleDeleteJob = async (id: string) => {
    try {
      await alumni.deleteJob(id);
      await fetchProfile();
    } catch (err) {
      setError('Failed to delete job. Please try again.');
    }
  };

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];
    try {
      await alumni.uploadProfileImage(file);
      await fetchProfile();
    } catch (err) {
      setError('Failed to upload profile image. Please try again.');
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading profile..." />;
  }

  if (error) {
    return (
      <div className="container py-5">
        <AlertMessage 
          type="danger" 
          message={error}
        />
        <button className="btn btn-primary mt-3" onClick={fetchProfile}>
          <i className="bi bi-arrow-clockwise me-2"></i>
          Try Again
        </button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container py-5">
        <div className="card bg-dark border-0 shadow">
          <div className="card-body p-4 text-center">
            <i className="bi bi-exclamation-circle text-warning display-1 mb-3"></i>
            <h3 className="text-white">No Profile Found</h3>
            <p className="text-muted">Your profile information is not available or hasn't been created yet.</p>
            <button className="btn btn-primary mt-3" onClick={() => setShowProfileForm(true)}>
              <i className="bi bi-plus-circle me-2"></i>
              Create Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  const mostRecentEducation = profile.education && profile.education.length > 0
    ? profile.education.sort((a, b) => parseInt(b.end_year) - parseInt(a.end_year))[0]
    : null;
    
  const currentJob = profile.jobs && profile.jobs.length > 0
    ? profile.jobs.find(job => job.is_current) || profile.jobs.sort((a, b) => 
        new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
      )[0]
    : null;

  return (
    <div className="bg-dark text-light">
      <div className="bg-black position-relative py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <div className="d-flex align-items-center mb-4">
                {profile.profile_image ? (
                  <img 
                    src={profile.profile_image} 
                    alt={profile.full_name} 
                    className="rounded-circle border border-3 border-primary me-4"
                    style={{ width: '120px', height: '120px', objectFit: 'cover' }} 
                  />
                ) : (
                  <div 
                    className="rounded-circle bg-dark d-flex align-items-center justify-content-center border border-3 border-primary me-4"
                    style={{ width: '120px', height: '120px' }}
                  >
                    <span className="text-primary display-4">{profile.full_name?.charAt(0) || 'A'}</span>
                  </div>
                )}
                <div>
                  <h1 className="display-5 fw-bold text-white mb-1">{profile.full_name}</h1>
                  <p className="lead text-muted mb-2">
                    {currentJob ? currentJob.position + ' at ' + currentJob.company_name : 'Alumni'}
                  </p>
                  <p className="mb-0">
                    {profile.current_location && (
                      <span className="badge bg-dark-subtle text-white me-2 py-2 px-3">
                        <i className="bi bi-geo-alt me-1"></i> {profile.current_location}
                      </span>
                    )}
                    {mostRecentEducation && (
                      <span className="badge bg-dark-subtle text-white me-2 py-2 px-3">
                        <i className="bi bi-mortarboard me-1"></i> {mostRecentEducation.institution}
                      </span>
                    )}
                    {profile.availability_for_mentorship && (
                      <span className="badge bg-primary text-white py-2 px-3">
                        <i className="bi bi-people me-1"></i> Available for Mentorship
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
              <button 
                className="btn btn-primary me-2"
                onClick={() => setShowProfileForm(true)}
              >
                <i className="bi bi-pencil-square me-2"></i>
                Edit Profile
              </button>
              <label className="btn btn-outline-light">
                <i className="bi bi-camera me-2"></i>
                Change Photo
                <input 
                  type="file"
                  className="d-none"
                  accept="image/*"
                  onChange={handleProfileImageUpload}
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-dark border-bottom border-secondary py-2">
        <div className="container">
          <ul className="nav nav-tabs border-0">
            <li className="nav-item">
              <button 
                className={`nav-link bg-transparent border-0 px-3 py-3 ${activeTab === 'overview' ? 'text-primary active' : 'text-muted'}`}
                onClick={() => setActiveTab('overview')}
              >
                <i className="bi bi-person me-2"></i>
                Overview
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link bg-transparent border-0 px-3 py-3 ${activeTab === 'education' ? 'text-primary active' : 'text-muted'}`}
                onClick={() => setActiveTab('education')}
              >
                <i className="bi bi-book me-2"></i>
                Education
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link bg-transparent border-0 px-3 py-3 ${activeTab === 'experience' ? 'text-primary active' : 'text-muted'}`}
                onClick={() => setActiveTab('experience')}
              >
                <i className="bi bi-briefcase me-2"></i>
                Experience
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link bg-transparent border-0 px-3 py-3 ${activeTab === 'contact' ? 'text-primary active' : 'text-muted'}`}
                onClick={() => setActiveTab('contact')}
              >
                <i className="bi bi-envelope me-2"></i>
                Contact
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="container py-5">
        {activeTab === 'overview' && (
          <div className="row">
            <div className="col-lg-8">
              <div className="card bg-dark border-0 shadow-sm mb-4">
                <div className="card-header bg-dark border-bottom border-secondary">
                  <h4 className="text-white m-0">About</h4>
                </div>
                <div className="card-body">
                  {profile.bio ? (
                    <p className="text-muted">{profile.bio}</p>
                  ) : (
                    <p className="text-muted fst-italic">No bio information available.</p>
                  )}
                </div>
              </div>
              
              <div className="card bg-dark border-0 shadow-sm mb-4">
                <div className="card-header bg-dark border-bottom border-secondary d-flex justify-content-between align-items-center">
                  <h4 className="text-white m-0">Education</h4>
                  <button 
                    className="btn btn-sm btn-outline-primary" 
                    onClick={() => {
                      setSelectedEducation(null);
                      setShowEducationForm(true);
                    }}
                  >
                    <i className="bi bi-plus-lg me-1"></i>
                    Add
                  </button>
                </div>
                <div className="card-body">
                  {profile.education && profile.education.length > 0 ? (
                    profile.education.slice(0, 2).map((edu, index) => (
                      <div key={edu.education_id || index} className={`${index !== 0 ? 'mt-3 pt-3 border-top border-secondary' : ''}`}>
                        <div className="d-flex">
                          <div className="bg-dark-subtle rounded-2 p-3 me-3 d-flex align-items-center justify-content-center" style={{width: '48px', height: '48px'}}>
                            <i className="bi bi-mortarboard-fill text-primary fs-3"></i>
                          </div>
                          <div>
                            <h5 className="text-white mb-1">{edu.degree}</h5>
                            <p className="text-primary mb-1">{edu.institution}</p>
                            <p className="text-muted small mb-1">{edu.department}</p>
                            <p className="text-muted small mb-0">{edu.start_year} - {edu.end_year}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted">No education details added yet.</p>
                  )}
                  
                  {profile.education && profile.education.length > 2 && (
                    <div className="text-center mt-3">
                      <button 
                        className="btn btn-sm btn-link text-primary" 
                        onClick={() => setActiveTab('education')}
                      >
                        View all education ({profile.education.length})
                        <i className="bi bi-arrow-right ms-2"></i>
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="card bg-dark border-0 shadow-sm">
                <div className="card-header bg-dark border-bottom border-secondary d-flex justify-content-between align-items-center">
                  <h4 className="text-white m-0">Experience</h4>
                  <button 
                    className="btn btn-sm btn-outline-primary" 
                    onClick={() => {
                      setSelectedJob(null);
                      setShowJobForm(true);
                    }}
                  >
                    <i className="bi bi-plus-lg me-1"></i>
                    Add
                  </button>
                </div>
                <div className="card-body">
                  {profile.jobs && profile.jobs.length > 0 ? (
                    profile.jobs.slice(0, 2).map((job, index) => (
                      <div key={job.job_id || index} className={`${index !== 0 ? 'mt-3 pt-3 border-top border-secondary' : ''}`}>
                        <div className="d-flex">
                          <div className="bg-dark-subtle rounded-2 p-3 me-3 d-flex align-items-center justify-content-center" style={{width: '48px', height: '48px'}}>
                            <i className="bi bi-briefcase-fill text-primary fs-3"></i>
                          </div>
                          <div>
                            <h5 className="text-white mb-1">{job.position}</h5>
                            <p className="text-primary mb-1">{job.company_name}</p>
                            <p className="text-muted small mb-1">{job.location}</p>
                            <p className="text-muted small mb-0">
                              {job.start_date} - {job.is_current ? 'Present' : job.end_date}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted">No job history added yet.</p>
                  )}
                  
                  {profile.jobs && profile.jobs.length > 2 && (
                    <div className="text-center mt-3">
                      <button 
                        className="btn btn-sm btn-link text-primary" 
                        onClick={() => setActiveTab('experience')}
                      >
                        View all experience ({profile.jobs.length})
                        <i className="bi bi-arrow-right ms-2"></i>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="col-lg-4 mt-4 mt-lg-0">
              <div className="card bg-dark border-0 shadow-sm mb-4">
                <div className="card-header bg-dark border-bottom border-secondary">
                  <h5 className="text-white m-0">Contact Information</h5>
                </div>
                <div className="card-body">
                  <ul className="list-unstyled mb-0">
                    {profile.email && (
                      <li className="d-flex align-items-center mb-3">
                        <div className="bg-dark-subtle rounded p-2 me-3">
                          <i className="bi bi-envelope text-primary"></i>
                        </div>
                        <div className="text-muted">{profile.email}</div>
                      </li>
                    )}
                    {profile.contact_number && (
                      <li className="d-flex align-items-center mb-3">
                        <div className="bg-dark-subtle rounded p-2 me-3">
                          <i className="bi bi-telephone text-primary"></i>
                        </div>
                        <div className="text-muted">{profile.contact_number}</div>
                      </li>
                    )}
                    {profile.current_location && (
                      <li className="d-flex align-items-center">
                        <div className="bg-dark-subtle rounded p-2 me-3">
                          <i className="bi bi-geo-alt text-primary"></i>
                        </div>
                        <div className="text-muted">{profile.current_location}</div>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
              
              <div className="card bg-dark border-0 shadow-sm">
                <div className="card-header bg-dark border-bottom border-secondary">
                  <h5 className="text-white m-0">Mentorship Status</h5>
                </div>
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className={`me-3 p-3 rounded-circle ${profile.availability_for_mentorship ? 'bg-success bg-opacity-25' : 'bg-danger bg-opacity-25'}`}>
                      <i className={`bi ${profile.availability_for_mentorship ? 'bi-check-lg text-success' : 'bi-x-lg text-danger'} fs-5`}></i>
                    </div>
                    <div>
                      <h6 className="text-white mb-1">
                        {profile.availability_for_mentorship ? 'Available for Mentorship' : 'Not Available for Mentorship'}
                      </h6>
                      <p className="text-muted small mb-0">
                        {profile.availability_for_mentorship 
                          ? 'You can be contacted by students for mentorship.' 
                          : 'You are currently not available for mentorship requests.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'education' && (
          <div className="card bg-dark border-0 shadow">
            <div className="card-header bg-dark border-bottom border-secondary d-flex justify-content-between align-items-center">
              <h4 className="text-white m-0">Education</h4>
              <button 
                className="btn btn-primary" 
                onClick={() => {
                  setSelectedEducation(null);
                  setShowEducationForm(true);
                }}
              >
                <i className="bi bi-plus-lg me-2"></i>
                Add Education
              </button>
            </div>
            <div className="card-body">
              {profile.education && profile.education.length > 0 ? (
                profile.education.map((edu, index) => (
                  <div key={edu.education_id || index} className={`${index !== 0 ? 'mt-4 pt-4 border-top border-secondary' : ''}`}>
                    <div className="d-flex flex-column flex-md-row">
                      <div className="bg-dark-subtle rounded-2 p-3 me-md-4 mb-3 mb-md-0 d-flex align-items-center justify-content-center align-self-start" style={{width: '64px', height: '64px'}}>
                        <i className="bi bi-mortarboard-fill text-primary fs-1"></i>
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex flex-column flex-md-row justify-content-between mb-2">
                          <h4 className="text-white mb-1">{edu.degree}</h4>
                          <div>
                            <button 
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => edu.education_id && handleDeleteEducation(edu.education_id.toString())}
                            >
                              <i className="bi bi-trash me-1"></i>
                              Delete
                            </button>
                          </div>
                        </div>
                        <h6 className="text-primary mb-2">{edu.institution}</h6>
                        <p className="text-muted mb-1">{edu.department}</p>
                        <p className="text-muted mb-3">{edu.start_year} - {edu.end_year}</p>
                        
                        <div className="row">
                          {edu.cgpa && (
                            <div className="col-md-6 mb-3">
                              <div className="card bg-dark-subtle border-0">
                                <div className="card-body py-2">
                                  <p className="small text-muted mb-1">CGPA</p>
                                  <p className="mb-0 text-white">{edu.cgpa}</p>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {edu.achievements && (
                            <div className="col-md-6 mb-3">
                              <div className="card bg-dark-subtle border-0">
                                <div className="card-body py-2">
                                  <p className="small text-muted mb-1">Achievements</p>
                                  <p className="mb-0 text-white">{edu.achievements}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-5">
                  <i className="bi bi-mortarboard text-muted display-1 mb-3"></i>
                  <h5 className="text-white">No Education Details</h5>
                  <p className="text-muted mb-4">You haven't added any education details to your profile yet.</p>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => {
                      setSelectedEducation(null);
                      setShowEducationForm(true);
                    }}
                  >
                    <i className="bi bi-plus-lg me-2"></i>
                    Add Education
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'experience' && (
          <div className="card bg-dark border-0 shadow">
            <div className="card-header bg-dark border-bottom border-secondary d-flex justify-content-between align-items-center">
              <h4 className="text-white m-0">Work Experience</h4>
              <button 
                className="btn btn-primary" 
                onClick={() => {
                  setSelectedJob(null);
                  setShowJobForm(true);
                }}
              >
                <i className="bi bi-plus-lg me-2"></i>
                Add Experience
              </button>
            </div>
            <div className="card-body">
              {profile.jobs && profile.jobs.length > 0 ? (
                profile.jobs.map((job, index) => (
                  <div key={job.job_id || index} className={`${index !== 0 ? 'mt-4 pt-4 border-top border-secondary' : ''}`}>
                    <div className="d-flex flex-column flex-md-row">
                      <div className="bg-dark-subtle rounded-2 p-3 me-md-4 mb-3 mb-md-0 d-flex align-items-center justify-content-center align-self-start" style={{width: '64px', height: '64px'}}>
                        <i className="bi bi-briefcase-fill text-primary fs-1"></i>
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex flex-column flex-md-row justify-content-between mb-2">
                          <div>
                            <h4 className="text-white mb-1">{job.position}</h4>
                            {job.is_current && (
                              <span className="badge bg-success text-white">Current Job</span>
                            )}
                          </div>
                          <div>
                            <button 
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => job.job_id && handleDeleteJob(job.job_id.toString())}
                            >
                              <i className="bi bi-trash me-1"></i>
                              Delete
                            </button>
                          </div>
                        </div>
                        <h6 className="text-primary mb-2">{job.company_name}</h6>
                        <p className="text-muted mb-1">{job.location}</p>
                        <p className="text-muted mb-3">
                          {job.start_date} - {job.is_current ? 'Present' : job.end_date}
                        </p>
                        
                        {job.description && (
                          <div className="card bg-dark-subtle border-0 mt-2">
                            <div className="card-body">
                              <p className="small text-muted mb-1">Job Description</p>
                              <p className="mb-0 text-white">{job.description}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-5">
                  <i className="bi bi-briefcase text-muted display-1 mb-3"></i>
                  <h5 className="text-white">No Work Experience</h5>
                  <p className="text-muted mb-4">You haven't added any work experience to your profile yet.</p>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => {
                      setSelectedJob(null);
                      setShowJobForm(true);
                    }}
                  >
                    <i className="bi bi-plus-lg me-2"></i>
                    Add Experience
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'contact' && (
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="card bg-dark border-0 shadow mb-4">
                <div className="card-header bg-dark border-bottom border-secondary">
                  <h4 className="text-white m-0">Contact Information</h4>
                </div>
                <div className="card-body">
                  <div className="row g-4">
                    <div className="col-md-6">
                      <div className="card bg-black bg-opacity-50 border-0 h-100">
                        <div className="card-body p-4">
                          <div className="d-flex align-items-center mb-3">
                            <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                              <i className="bi bi-envelope-fill text-primary fs-4"></i>
                            </div>
                            <h5 className="text-white mb-0">Email Address</h5>
                          </div>
                          <p className="text-muted mb-0">{profile.email || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="card bg-black bg-opacity-50 border-0 h-100">
                        <div className="card-body p-4">
                          <div className="d-flex align-items-center mb-3">
                            <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                              <i className="bi bi-telephone-fill text-primary fs-4"></i>
                            </div>
                            <h5 className="text-white mb-0">Phone Number</h5>
                          </div>
                          <p className="text-muted mb-0">{profile.contact_number || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="card bg-black bg-opacity-50 border-0 h-100">
                        <div className="card-body p-4">
                          <div className="d-flex align-items-center mb-3">
                            <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                              <i className="bi bi-geo-alt-fill text-primary fs-4"></i>
                            </div>
                            <h5 className="text-white mb-0">Current Location</h5>
                          </div>
                          <p className="text-muted mb-0">{profile.current_location || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="card bg-black bg-opacity-50 border-0 h-100">
                        <div className="card-body p-4">
                          <div className="d-flex align-items-center mb-3">
                            <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                              <i className="bi bi-people-fill text-primary fs-4"></i>
                            </div>
                            <h5 className="text-white mb-0">Mentorship Status</h5>
                          </div>
                          <p className="text-muted mb-0">
                            {profile.availability_for_mentorship ? 'Available for mentorship' : 'Not available for mentorship'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center mt-4">
                    <button 
                      className="btn btn-primary"
                      onClick={() => setShowProfileForm(true)}
                    >
                      <i className="bi bi-pencil-square me-2"></i>
                      Update Contact Information
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showProfileForm && (
        <ProfileInfoForm
          profile={profile}
          onClose={() => setShowProfileForm(false)}
          onSubmit={handleProfileUpdate}
        />
      )}

      {showEducationForm && (
        <EducationForm
          education={selectedEducation}
          onClose={() => setShowEducationForm(false)}
          onSubmit={handleAddEducation}
        />
      )}

      {showJobForm && (
        <JobForm
          job={selectedJob}
          onClose={() => setShowJobForm(false)}
          onSubmit={handleAddJob}
        />
      )}
    </div>
  );
};

export default AlumniProfile;