import React, { useState, useEffect } from 'react';
import { alumni } from '../../services/api';
import { Education, Job } from '../../types';

// Ensure the `ProfileType` includes `full_name` and other required properties
interface ExtendedProfileType {
  full_name: string;
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
          Try Again
        </button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container py-5">
        <AlertMessage 
          type="warning" 
          message="No profile data available. Please create your profile."
        />
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Profile Header */}
      <div className="row mb-4">
        <div className="col-md-8">
          <h2>{profile.full_name}</h2>
          <p className="text-muted mb-2">
            {profile.education && profile.education.length > 0 
              ? `${profile.education[0].degree}, ${profile.education[0].department}` 
              : 'No education information'}
          </p>
          <p>{profile.bio || 'No bio available'}</p>
        </div>
        <div className="col-md-4 text-md-end">
          <div className="mb-3">
            <button 
              className="btn btn-primary me-2" 
              onClick={() => setShowProfileForm(true)}
            >
              Edit Profile
            </button>
            <label className="btn btn-outline-secondary">
              Upload Photo
              <input 
                type="file" 
                className="d-none" 
                accept="image/*" 
                onChange={handleProfileImageUpload} 
              />
            </label>
          </div>
          <div>
            {profile.profile_image && (
              <img 
                src={profile.profile_image} 
                alt="Profile" 
                className="img-thumbnail rounded-circle" 
                style={{ width: '100px', height: '100px', objectFit: 'cover' }} 
              />
            )}
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

      {/* Contact Information */}
      <div className="card mb-4">
        <div className="card-header bg-light">
          <h4 className="mb-0">Contact Information</h4>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <p><strong>Email:</strong> {profile.email || 'Not provided'}</p>
              <p><strong>Phone:</strong> {profile.contact_number || 'Not provided'}</p>
            </div>
            <div className="col-md-6">
              <p><strong>Current Location:</strong> {profile.current_location || 'Not provided'}</p>
              <p><strong>Available for Mentorship:</strong> {profile.availability_for_mentorship ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
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