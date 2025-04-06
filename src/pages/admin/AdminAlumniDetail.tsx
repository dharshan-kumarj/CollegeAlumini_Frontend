import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { admin } from '../../services/api';
import { AlumniProfile, Education, Job } from '../../types';
import EducationForm from '../../components/alumni/EducationForm';
import JobForm from '../../components/alumni/JobForm';

const AdminAlumniDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<AlumniProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showEducationForm, setShowEducationForm] = useState<boolean>(false);
  const [showJobForm, setShowJobForm] = useState<boolean>(false);
  const [selectedEducation, setSelectedEducation] = useState<Education | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<string>('');

  const fetchProfile = async () => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      const response = await admin.getAlumniById(id);
      setProfile(response.data);
      setVerificationStatus(response.data.verification_status || 'pending');
      setError(null);
    } catch (err) {
      setError('Failed to load alumni profile. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const handleUpdateVerificationStatus = async () => {
    if (!id || !profile) return;
    
    try {
      await admin.updateAlumni(id, {
        verification_status: verificationStatus
      });
      fetchProfile();
    } catch (err) {
      setError('Failed to update verification status. Please try again.');
    }
  };

  const handleAddEducation = async (education: Omit<Education, 'id'>) => {
    if (!id) return;
    
    try {
      await admin.addEducation(id, education);
      fetchProfile();
      setShowEducationForm(false);
    } catch (err) {
      setError('Failed to add education. Please try again.');
    }
  };

  const handleDeleteEducation = async (educationId: string) => {
    if (!id) return;
    
    try {
      await admin.deleteEducation(id, educationId);
      fetchProfile();
    } catch (err) {
      setError('Failed to delete education. Please try again.');
    }
  };

  const handleAddJob = async (job: Omit<Job, 'id'>) => {
    if (!id) return;
    
    try {
      await admin.addJob(id, job);
      fetchProfile();
      setShowJobForm(false);
    } catch (err) {
      setError('Failed to add job. Please try again.');
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!id) return;
    
    try {
      await admin.deleteJob(id, jobId);
      fetchProfile();
    } catch (err) {
      setError('Failed to delete job. Please try again.');
    }
  };

  const handleDeleteAlumni = async () => {
    if (!id || !profile) return;
    
    if (window.confirm(`Are you sure you want to delete ${profile.full_name}'s profile? This action cannot be undone.`)) {
      try {
        await admin.deleteAlumni(id);
        navigate('/admin/alumni');
      } catch (err) {
        setError('Failed to delete alumni profile. Please try again.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading alumni profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error}
          <button className="btn btn-link" onClick={fetchProfile}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">
          Alumni profile not found.
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/admin/alumni')}>
          Back to Alumni List
        </button>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Alumni Profile: {profile.full_name}</h2>
        <div>
          <button
            className="btn btn-outline-danger me-2"
            onClick={handleDeleteAlumni}
          >
            Delete Profile
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate('/admin/alumni')}
          >
            Back to List
          </button>
        </div>
      </div>

      {/* Profile Overview */}
      <div className="card mb-4">
        <div className="card-header bg-light">
          <h4 className="mb-0">Profile Overview</h4>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-2 mb-3 mb-md-0 text-center">
              {profile.profile_image ? (
                <img
                  src={profile.profile_image}
                  alt={profile.full_name}
                  className="img-thumbnail rounded-circle profile-image"
                />
              ) : (
                <div
                  className="bg-secondary rounded-circle text-white d-flex align-items-center justify-content-center mx-auto profile-image"
                >
                  {profile.full_name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="col-md-7">
              <h3 className="mb-2">{profile.full_name}</h3>
              <p className="text-muted mb-2">
                {profile.education && profile.education.length > 0
                  ? `${profile.education[0].degree}, ${profile.education[0].department}`
                  : 'No education information'}
              </p>
              <p>{profile.bio || 'No bio available'}</p>
              <div className="row mt-3">
                <div className="col-md-6">
                  <p className="mb-1">
                    <strong>Email:</strong> {profile.email || 'Not provided'}
                  </p>
                  <p className="mb-1">
                    <strong>Contact:</strong> {profile.contact_number || 'Not provided'}
                  </p>
                </div>
                <div className="col-md-6">
                  <p className="mb-1">
                    <strong>Location:</strong> {profile.current_location || 'Not provided'}
                  </p>
                  <p className="mb-1">
                    <strong>Mentorship:</strong> {profile.availability_for_mentorship ? 'Available' : 'Not Available'}
                  </p>
                </div>
              </div>
            </div>
            {/* <div className="col-md-3">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">Verification Status</h5>
                  <div className="mb-3">
                    <select
                      className="form-select"
                      value={verificationStatus}
                      onChange={(e) => setVerificationStatus(e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="verified">Verified</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  <button
                    className="btn btn-primary w-100"
                    onClick={handleUpdateVerificationStatus}
                  >
                    Update Status
                  </button>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      {/* Education Section */}
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center bg-light">
          <h4 className="mb-0">Education</h4>
          <button 
            className="btn btn-sm btn-primary" 
            onClick={() => {
              setSelectedEducation(null);
              setShowEducationForm(true);
            }}
          >
            Add Education
          </button>
        </div>
        <div className="card-body">
          {profile.education && profile.education.length > 0 ? (
            profile.education.map((edu, index) => (
              <div key={edu.education_id || index} className="mb-3 pb-3 border-bottom">
                <div className="d-flex justify-content-between">
                  <div>
                    <h5>{edu.degree}</h5>
                    <p className="mb-1">{edu.department} - {edu.institution}</p>
                    <p className="text-muted">{edu.start_year} - {edu.end_year}</p>
                    {edu.achievements && <p><strong>Achievements:</strong> {edu.achievements}</p>}
                    {edu.cgpa && <p><strong>CGPA:</strong> {edu.cgpa}</p>}
                  </div>
                  <div>
                    <button 
                      className="btn btn-sm btn-outline-danger" 
                      onClick={() => edu.education_id && handleDeleteEducation(edu.education_id.toString())}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted">No education details added yet.</p>
          )}
        </div>
      </div>

      {/* Job History Section */}
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center bg-light">
          <h4 className="mb-0">Work Experience</h4>
          <button 
            className="btn btn-sm btn-primary" 
            onClick={() => {
              setSelectedJob(null);
              setShowJobForm(true);
            }}
          >
            Add Job
          </button>
        </div>
        <div className="card-body">
          {profile.jobs && profile.jobs.length > 0 ? (
            profile.jobs.map((job, index) => (
              <div key={job.job_id || index} className="mb-3 pb-3 border-bottom">
                <div className="d-flex justify-content-between">
                  <div>
                    <h5>{job.position}</h5>
                    <p className="mb-1">{job.company_name} - {job.location}</p>
                    <p className="text-muted">
                      {job.start_date} - {job.is_current ? 'Present' : job.end_date}
                    </p>
                    {job.description && <p>{job.description}</p>}
                  </div>
                  <div>
                    <button 
                      className="btn btn-sm btn-outline-danger" 
                      onClick={() => job.job_id && handleDeleteJob(job.job_id.toString())}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted">No job history added yet.</p>
          )}
        </div>
      </div>

      {/* Modals */}
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

export default AdminAlumniDetail;