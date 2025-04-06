import React, { useEffect, useState } from 'react';
import { getAllAlumni } from '../services/api';
import { Alumni } from '../types';

const AdminHome: React.FC = () => {
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [filteredAlumni, setFilteredAlumni] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    department: '',
    batchYear: '',
    verificationStatus: ''
  });
  const [activeTab, setActiveTab] = useState('manage');

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const data = await getAllAlumni();
        setAlumni(data);
        setFilteredAlumni(data);
      } catch (err) {
        console.error('Error fetching alumni:', err);
        setError('Failed to load alumni data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAlumni();
  }, []);

  // Filter alumni based on search and filters
  useEffect(() => {
    let result = alumni;
    
    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(alumnus => 
        alumnus.user.username.toLowerCase().includes(searchLower) || 
        (alumnus.user.first_name && alumnus.user.first_name.toLowerCase().includes(searchLower)) ||
        (alumnus.user.last_name && alumnus.user.last_name.toLowerCase().includes(searchLower))
      );
    }
    
    // Department filter
    if (filters.department) {
      result = result.filter(alumnus => 
        alumnus.education_records.some(edu => 
          edu.department_name && edu.department_name.includes(filters.department)
        )
      );
    }
    
    // Batch year filter
    if (filters.batchYear) {
      const year = parseInt(filters.batchYear);
      result = result.filter(alumnus => 
        alumnus.education_records.some(edu => 
          edu.batch_year_end === year
        )
      );
    }
    
    // Verification status filter
    if (filters.verificationStatus) {
      const isVerified = filters.verificationStatus === 'verified';
      result = result.filter(alumnus => alumnus.is_verified === isVerified);
    }
    
    setFilteredAlumni(result);
  }, [search, filters, alumni]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleVerify = (alumniId: number) => {
    // Here you would call your API to verify the alumni
    console.log(`Verifying alumni with ID: ${alumniId}`);
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}>
        <div className="loading-spinner"></div>
        <p>Loading alumni data...</p>
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
      <h1>Admin Dashboard</h1>
      
      <div className="tabs">
        <div 
          className={`tab ${activeTab === 'manage' ? 'active' : ''}`}
          onClick={() => setActiveTab('manage')}
        >
          Manage Alumni
        </div>
        <div 
          className={`tab ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          Statistics
        </div>
      </div>
      
      {activeTab === 'manage' && (
        <div className="card">
          <div className="card-header">
            <h2>Alumni Management</h2>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '20px' }}>
              <div>
                <input
                  type="text"
                  placeholder="Search alumni..."
                  className="form-input"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              
              <div>
                <select 
                  name="department"
                  className="form-input"
                  value={filters.department}
                  onChange={handleFilterChange}
                >
                  <option value="">All Departments</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Mechanical">Mechanical</option>
                </select>
              </div>
              
              <div>
                <select 
                  name="batchYear" 
                  className="form-input"
                  value={filters.batchYear}
                  onChange={handleFilterChange}
                >
                  <option value="">All Batch Years</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                  <option value="2020">2020</option>
                </select>
              </div>
              
              <div>
                <select 
                  name="verificationStatus" 
                  className="form-input"
                  value={filters.verificationStatus}
                  onChange={handleFilterChange}
                >
                  <option value="">All Status</option>
                  <option value="verified">Verified</option>
                  <option value="pending">Pending Verification</option>
                </select>
              </div>
            </div>
            
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Name</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Email</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Batch</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Department</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAlumni.map(alumnus => (
                  <tr key={alumnus.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '10px' }}>
                      {alumnus.user.first_name && alumnus.user.last_name 
                        ? `${alumnus.user.first_name} ${alumnus.user.last_name}`
                        : alumnus.user.username
                      }
                    </td>
                    <td style={{ padding: '10px' }}>{alumnus.user.email}</td>
                    <td style={{ padding: '10px' }}>
                      {alumnus.education_records.length > 0 
                        ? alumnus.education_records[0].batch_year_end
                        : '-'
                      }
                    </td>
                    <td style={{ padding: '10px' }}>
                      {alumnus.education_records.length > 0 
                        ? alumnus.education_records[0].department_name || '-'
                        : '-'
                      }
                    </td>
                    <td style={{ padding: '10px' }}>
                      {alumnus.is_verified ? (
                        <span style={{ color: 'var(--success)' }}>Verified</span>
                      ) : (
                        <span style={{ color: 'var(--danger)' }}>Pending</span>
                      )}
                    </td>
                    <td style={{ padding: '10px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-secondary" style={{ padding: '5px 10px' }}>View</button>
                        <button className="btn btn-primary" style={{ padding: '5px 10px' }}>Edit</button>
                        {!alumnus.is_verified && (
                          <button 
                            className="btn btn-success" 
                            style={{ padding: '5px 10px' }}
                            onClick={() => handleVerify(alumnus.id)}
                          >
                            Verify
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredAlumni.length === 0 && (
              <p style={{ textAlign: 'center', padding: '20px 0' }}>No alumni records found matching your criteria.</p>
            )}
          </div>
        </div>
      )}
      
      {activeTab === 'stats' && (
        <div className="card">
          <div className="card-header">
            <h2>Alumni Statistics</h2>
          </div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
              <div className="card">
                <div className="card-body" style={{ textAlign: 'center' }}>
                  <h3>{alumni.length}</h3>
                  <p>Total Alumni</p>
                </div>
              </div>
              
              <div className="card">
                <div className="card-body" style={{ textAlign: 'center' }}>
                  <h3>{alumni.filter(a => a.is_verified).length}</h3>
                  <p>Verified Alumni</p>
                </div>
              </div>
              
              <div className="card">
                <div className="card-body" style={{ textAlign: 'center' }}>
                  <h3>{alumni.filter(a => !a.is_verified).length}</h3>
                  <p>Pending Verification</p>
                </div>
              </div>
              
              <div className="card">
                <div className="card-body" style={{ textAlign: 'center' }}>
                  <h3>
                    {[...new Set(alumni.flatMap(a => 
                      a.education_records.map(e => e.department_name)
                    ).filter(Boolean))].length}
                  </h3>
                  <p>Departments</p>
                </div>
              </div>
            </div>
            
            {/* You could add charts/graphs here in a real application */}
            <div style={{ marginTop: '30px', textAlign: 'center', padding: '30px', border: '1px dashed var(--border-color)' }}>
              <p>Charts and detailed analytics would be displayed here.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHome;