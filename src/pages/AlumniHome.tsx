import React, { useEffect, useState } from 'react';
import { getAlumniProfile, getAllAlumni } from '../services/api';
import { Alumni } from '../types';

const AlumniHome: React.FC = () => {
  const [myProfile, setMyProfile] = useState<Alumni | null>(null);
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

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
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }
  
  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-12 mb-4">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                My Profile
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'alumni' ? 'active' : ''}`}
                onClick={() => setActiveTab('alumni')}
              >
                Alumni Directory
              </button>
            </li>
          </ul>
        </div>
      </div>

      {activeTab === 'profile' && myProfile && (
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="card">
              <div className="card-body text-center">
                {myProfile.profile_picture ? (
                  <img 
                    src={myProfile.profile_picture} 
                    alt="Profile" 
                    className="rounded-circle img-thumbnail"
                    style={{ width: '150px', height: '150px', objectFit: 'cover' }} 
                  />
                ) : (
                  <div 
                    className="bg-secondary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                    style={{ width: '150px', height: '150px' }}
                  >
                    <span className="text-white" style={{ fontSize: '3rem' }}>
                      {myProfile.user.first_name?.charAt(0) || myProfile.user.username.charAt(0)}
                    </span>
                  </div>
                )}
                <h4 className="mt-3">
                  {myProfile.user.first_name && myProfile.user.last_name 
                    ? `${myProfile.user.first_name} ${myProfile.user.last_name}`
                    : myProfile.user.username
                  }
                </h4>
                {myProfile.is_verified ? (
                  <span className="badge bg-success">Verified Alumni</span>
                ) : (
                  <span className="badge bg-warning">Verification Pending</span>
                )}
              </div>
            </div>
            
            <div className="card mt-3">
              <div className="card-header">
                <h5 className="card-title mb-0">Contact Information</h5>
              </div>
              <div className="card-body">
                <p><strong>Email:</strong> {myProfile.user.email}</p>
                {myProfile.phone && <p><strong>Phone:</strong> {myProfile.phone}</p>}
                {myProfile.address && (
                  <p>
                    <strong>Location:</strong> {myProfile.city}{myProfile.state ? `, ${myProfile.state}` : ''}
                    {myProfile.country ? `, ${myProfile.country}` : ''}
                  </p>
                )}
                {myProfile.linkedin_url && (
                  <p>
                    <strong>LinkedIn:</strong> <a href={myProfile.linkedin_url} target="_blank" rel="noopener noreferrer">Profile</a>
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className="col-md-8">
            {myProfile.bio && (
              <div className="card mb-4">
                <div className="card-header">
                  <h5 className="card-title mb-0">About</h5>
                </div>
                <div className="card-body">
                  <p>{myProfile.bio}</p>
                </div>
              </div>
            )}
            
            {myProfile.education_records.length > 0 && (
              <div className="card mb-4">
                <div className="card-header">
                  <h5 className="card-title mb-0">Education</h5>
                </div>
                <div className="card-body">
                  {myProfile.education_records.map((education, index) => (
                    <div key={index} className={index > 0 ? 'mt-3 pt-3 border-top' : ''}>
                      <h6>{education.degree} {education.major && `in ${education.major}`}</h6>
                      <p className="mb-1">{education.department_name || `Department ID: ${education.department_id}`}</p>
                      <p className="text-muted mb-1">{education.batch_year_start} - {education.batch_year_end}</p>
                      {education.achievements && <p><small>{education.achievements}</small></p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {myProfile.employment_records.length > 0 && (
              <div className="card mb-4">
                <div className="card-header">
                  <h5 className="card-title mb-0">Work Experience</h5>
                </div>
                <div className="card-body">
                  {myProfile.employment_records.map((employment, index) => (
                    <div key={index} className={index > 0 ? 'mt-3 pt-3 border-top' : ''}>
                      <h6>{employment.job_title}</h6>
                      <p className="mb-1">{employment.company_name}</p>
                      <p className="text-muted mb-1">
                        {new Date(employment.start_date).toLocaleDateString()} - 
                        {employment.is_current 
                          ? ' Present'
                          : employment.end_date && ` ${new Date(employment.end_date).toLocaleDateString()}`
                        }
                      </p>
                      {employment.location && <p className="mb-1"><small>{employment.location}</small></p>}
                      {employment.description && <p><small>{employment.description}</small></p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {myProfile.skill_associations.length > 0 && (
              <div className="card mb-4">
                <div className="card-header">
                  <h5 className="card-title mb-0">Skills</h5>
                </div>
                <div className="card-body">
                  <div className="d-flex flex-wrap gap-2">
                    {myProfile.skill_associations.map((skill, index) => (
                      <span key={index} className="badge bg-light text-dark p-2">
                        {skill.skill_name || `Skill #${skill.skill_id}`}
                        {skill.proficiency_level && ` (${skill.proficiency_level})`}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {myProfile.achievements.length > 0 && (
              <div className="card mb-4">
                <div className="card-header">
                  <h5 className="card-title mb-0">Achievements</h5>
                </div>
                <div className="card-body">
                  {myProfile.achievements.map((achievement, index) => (
                    <div key={index} className={index > 0 ? 'mt-3 pt-3 border-top' : ''}>
                      <h6>{achievement.title}</h6>
                      {achievement.organization && <p className="mb-1">{achievement.organization}</p>}
                      {achievement.achievement_date && (
                        <p className="text-muted mb-1">
                          {new Date(achievement.achievement_date).toLocaleDateString()}
                        </p>
                      )}
                      {achievement.description && <p><small>{achievement.description}</small></p>}
                      {achievement.reference_link && (
                        <a href={achievement.reference_link} target="_blank" rel="noopener noreferrer">
                          View Reference
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'alumni' && (
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Alumni Directory</h5>
                <div className="input-group" style={{ width: '300px' }}>
                  <input type="text" className="form-control" placeholder="Search alumni..." />
                  <button className="btn btn-outline-secondary" type="button">Search</button>
                </div>
              </div>
              <div className="card-body">
                {alumni.length > 0 ? (
                  <div className="row">
                    {alumni.map(alumnus => (
                      <div key={alumnus.id} className="col-md-6 col-lg-4 mb-4">
                        <div className="card h-100">
                          <div className="card-body">
                            <div className="d-flex mb-3">
                              <div 
                                className="bg-secondary rounded-circle d-flex align-items-center justify-content-center me-3"
                                style={{ width: '60px', height: '60px', minWidth: '60px' }}
                              >
                                {alumnus.profile_picture ? (
                                  <img 
                                    src={alumnus.profile_picture} 
                                    alt="Profile" 
                                    className="rounded-circle" 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                  />
                                ) : (
                                  <span className="text-white">
                                    {alumnus.user.first_name?.charAt(0) || alumnus.user.username.charAt(0)}
                                  </span>
                                )}
                              </div>
                              <div>
                                <h6 className="mb-0">
                                  {alumnus.user.first_name && alumnus.user.last_name 
                                    ? `${alumnus.user.first_name} ${alumnus.user.last_name}`
                                    : alumnus.user.username
                                  }
                                </h6>
                                {alumnus.employment_records.length > 0 && (
                                  <p className="text-muted small mb-1">
                                    {alumnus.employment_records[0].job_title} at {alumnus.employment_records[0].company_name}
                                  </p>
                                )}
                                {alumnus.education_records.length > 0 && (
                                  <p className="text-muted small mb-0">
                                    {alumnus.education_records[0].degree}, 
                                    {alumnus.education_records[0].batch_year_end}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="d-flex justify-content-end mt-2">
                              <button className="btn btn-sm btn-primary">Connect</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center my-4">No alumni records found.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlumniHome;