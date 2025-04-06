import React, { useEffect, useState } from 'react';
import { getAlumniProfile, getAllAlumni } from '../services/api';
import { Alumni } from '../types';

const AlumniHome: React.FC = () => {
  const [myProfile, setMyProfile] = useState<Alumni | null>(null);
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profile = await getAlumniProfile();
        setMyProfile(profile);
        
        const allAlumni = await getAllAlumni({ limit: 10 });
        setAlumni(allAlumni);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}>
        <div className="loading-spinner"></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ marginTop: '50px' }}>
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Tabs Navigation */}
      <div className="tabs">
        <div 
          className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          My Profile
        </div>
        <div 
          className={`tab ${activeTab === 'alumni' ? 'active' : ''}`}
          onClick={() => setActiveTab('alumni')}
        >
          Alumni Directory
        </div>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && myProfile && (
        <div className="card">
          <div className="card-header">
            <h2>Your Profile</h2>
            <button 
              className="btn btn-secondary" 
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
          
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Basic Info */}
              <div className="card">
                <div className="card-header">Basic Information</div>
                <div className="card-body" style={{ display: 'flex', gap: '20px' }}>
                  <div style={{ textAlign: 'center' }}>
                    {myProfile.profile_picture ? (
                      <img 
                        src={myProfile.profile_picture} 
                        alt="Profile" 
                        className="profile-image"
                      />
                    ) : (
                      <div className="profile-placeholder">
                        {myProfile.user.first_name?.charAt(0) || myProfile.user.username.charAt(0)}
                      </div>
                    )}
                    
                    {editMode && (
                      <div className="mt-3">
                        <input 
                          type="file" 
                          accept="image/*" 
                          id="profile-image" 
                          style={{ display: 'none' }}
                        />
                        <label htmlFor="profile-image" className="btn btn-secondary">
                          Change Photo
                        </label>
                      </div>
                    )}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    {editMode ? (
                      <div>
                        <div className="form-group">
                          <label htmlFor="full-name" className="form-label">Full Name</label>
                          <input
                            type="text"
                            id="full-name"
                            className="form-input"
                            defaultValue={`${myProfile.user.first_name || ''} ${myProfile.user.last_name || ''}`}
                          />
                        </div>
                        
                        <div className="form-group">
                          <label htmlFor="bio" className="form-label">Bio</label>
                          <textarea
                            id="bio"
                            className="form-input"
                            rows={3}
                            defaultValue={myProfile.bio || ''}
                          ></textarea>
                        </div>
                        
                        <div className="form-group">
                          <label htmlFor="email" className="form-label">Email</label>
                          <input
                            type="email"
                            id="email"
                            className="form-input"
                            defaultValue={myProfile.user.email}
                            disabled
                          />
                        </div>
                        
                        <div className="form-group">
                          <label htmlFor="phone" className="form-label">Phone</label>
                          <input
                            type="tel"
                            id="phone"
                            className="form-input"
                            defaultValue={myProfile.phone || ''}
                          />
                        </div>
                        
                        <div className="form-group">
                          <label htmlFor="location" className="form-label">Location</label>
                          <input
                            type="text"
                            id="location"
                            className="form-input"
                            defaultValue={`${myProfile.city || ''} ${myProfile.state || ''} ${myProfile.country || ''}`}
                          />
                        </div>
                        
                        <button className="btn btn-primary">Save Changes</button>
                      </div>
                    ) : (
                      <div>
                        <h3>
                          {myProfile.user.first_name && myProfile.user.last_name 
                            ? `${myProfile.user.first_name} ${myProfile.user.last_name}`
                            : myProfile.user.username
                          }
                        </h3>
                        <p className="mb-3">{myProfile.bio || 'No bio provided'}</p>
                        <p><strong>Email:</strong> {myProfile.user.email}</p>
                        <p><strong>Phone:</strong> {myProfile.phone || 'Not provided'}</p>
                        <p>
                          <strong>Location:</strong> {' '}
                          {myProfile.city || myProfile.state || myProfile.country
                            ? `${myProfile.city || ''} ${myProfile.state || ''} ${myProfile.country || ''}`
                            : 'Not provided'
                          }
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Education */}
              <div className="card">
                <div className="card-header">
                  <div>Education</div>
                  {editMode && (
                    <button className="btn btn-secondary">+ Add Education</button>
                  )}
                </div>
                <div className="card-body">
                  {myProfile.education_records.length > 0 ? (
                    myProfile.education_records.map((education, index) => (
                      <div key={index} className={index > 0 ? 'mt-3 pt-3' : ''} style={{ borderTop: index > 0 ? `1px solid var(--border-color)` : 'none' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <h4>{education.degree} {education.major ? `in ${education.major}` : ''}</h4>
                            <p>{education.department_name || `Department ID: ${education.department_id}`}</p>
                            <p style={{ color: 'var(--text-secondary)' }}>
                              {education.batch_year_start} - {education.batch_year_end}
                            </p>
                            {education.achievements && <p>{education.achievements}</p>}
                          </div>
                          {editMode && (
                            <div>
                              <button className="btn btn-secondary">Edit</button>
                              <button className="btn btn-danger ml-2" style={{ marginLeft: '8px' }}>Delete</button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No education records found. {editMode && 'Click "Add Education" to add your educational background.'}</p>
                  )}
                </div>
              </div>
              
              {/* Work Experience */}
              <div className="card">
                <div className="card-header">
                  <div>Work Experience</div>
                  {editMode && (
                    <button className="btn btn-secondary">+ Add Job</button>
                  )}
                </div>
                <div className="card-body">
                  {myProfile.employment_records.length > 0 ? (
                    myProfile.employment_records.map((job, index) => (
                      <div key={index} className={index > 0 ? 'mt-3 pt-3' : ''} style={{ borderTop: index > 0 ? `1px solid var(--border-color)` : 'none' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <h4>{job.job_title}</h4>
                            <p>{job.company_name}</p>
                            <p style={{ color: 'var(--text-secondary)' }}>
                              {new Date(job.start_date).toLocaleDateString()} - 
                              {job.is_current 
                                ? ' Present'
                                : job.end_date ? ` ${new Date(job.end_date).toLocaleDateString()}` : ''
                              }
                            </p>
                            {job.location && <p>{job.location}</p>}
                            {job.description && <p>{job.description}</p>}
                          </div>
                          {editMode && (
                            <div>
                              <button className="btn btn-secondary">Edit</button>
                              <button className="btn btn-danger ml-2" style={{ marginLeft: '8px' }}>Delete</button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No work experience found. {editMode && 'Click "Add Job" to add your work experience.'}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alumni Directory Tab */}
      {activeTab === 'alumni' && (
        <div className="card">
          <div className="card-header">
            <h2>Alumni Directory</h2>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="text" 
                placeholder="Search alumni..." 
                className="form-input" 
                style={{ width: '200px' }} 
              />
              <button className="btn btn-primary">Search</button>
            </div>
          </div>
          <div className="card-body">
            <div className="grid">
              {alumni.map(alumnus => (
                <div key={alumnus.id} className="card">
                  <div className="card-body">
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                      {alumnus.profile_picture ? (
                        <img 
                          src={alumnus.profile_picture} 
                          alt={alumnus.user.username} 
                          style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }} 
                        />
                      ) : (
                        <div style={{ 
                          width: '60px', 
                          height: '60px', 
                          borderRadius: '50%', 
                          backgroundColor: 'var(--accent-color)', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          color: 'white', 
                          fontSize: '1.5rem' 
                        }}>
                          {alumnus.user.first_name?.charAt(0) || alumnus.user.username.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h4>{alumnus.user.first_name && alumnus.user.last_name 
                          ? `${alumnus.user.first_name} ${alumnus.user.last_name}`
                          : alumnus.user.username}
                        </h4>
                        {alumnus.employment_records.length > 0 && (
                          <p style={{ margin: 0 }}>
                            {alumnus.employment_records[0].job_title} at {alumnus.employment_records[0].company_name}
                          </p>
                        )}
                        {alumnus.education_records.length > 0 && (
                          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                            {alumnus.education_records[0].degree}, {alumnus.education_records[0].batch_year_end}
                          </p>
                        )}
                      </div>
                    </div>
                    <button 
                      className="btn btn-secondary mt-3"
                      style={{ width: '100%' }}
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {alumni.length === 0 && (
              <p style={{ textAlign: 'center', padding: '40px 0' }}>No alumni records found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AlumniHome;