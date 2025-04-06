import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { admin } from '../../services/api';
import { AlumniProfile, PaginatedResponse } from '../../types';
import LoadingSpinner from '../../components/LoadingSpinner';
import AlertMessage from '../../components/AlertMessage';

const AlumniList: React.FC = () => {
  const navigate = useNavigate();
  const [alumni, setAlumni] = useState<PaginatedResponse<AlumniProfile> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filters, setFilters] = useState<Record<string, string>>({
    department: '',
    graduation_year: '',
    location: '',
    available_for_mentorship: ''
  });

  const fetchAlumni = async (page: number) => {
    try {
      setIsLoading(true);
      const response = await admin.getAllAlumni(page);
      const { data, total, page: currentPage, per_page, total_pages } = response.data;

      setAlumni({
        items: data,
        total,
        page: currentPage,
        per_page,
        total_pages
      });
      setError(null);
    } catch (err) {
      console.error('Failed to load alumni:', err);
      setError('Failed to load alumni data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumni(currentPage);
  }, [currentPage, filters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Reset to first page when searching
    setCurrentPage(1);
    
    // Search is implemented as a filter on department, name or company
    fetchAlumni(1);
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    setCurrentPage(1);
  };

  const handleDeleteAlumni = async (id: string) => {
    if (window.confirm(`Are you sure you want to delete this alumni profile?`)) {
      try {
        await admin.deleteAlumni(id);
        // Refresh the list
        fetchAlumni(currentPage);
      } catch (err) {
        setError('Failed to delete alumni. Please try again.');
      }
    }
  };

  const getVerificationBadgeColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'verified':
        return 'success';
      case 'rejected':
        return 'danger';
      case 'pending':
      default:
        return 'warning';
    }
  };

  // Add a null check for alumni and items before accessing length
  const totalAlumni = alumni?.items?.length || 0;
  const hasAlumni = totalAlumni > 0;

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Alumni List</h2>
      </div>

      {/* Search and Filter Controls */}
      <div className="card mb-4">
        <div className="card-body">
          <form onSubmit={handleSearch} className="mb-3">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search by name, company, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn btn-primary" type="submit">
                Search
              </button>
              <button 
                className="btn btn-outline-secondary"
                onClick={() => {
                  setSearchTerm('');
                  setFilters({
                    department: '',
                    graduation_year: '',
                    location: '',
                    available_for_mentorship: ''
                  });
                  setCurrentPage(1);
                }}
              >
                Clear
              </button>
            </div>
          </form>

          <div className="row g-2">
            <div className="col-md-3">
              <select
                className="form-select"
                value={filters.department}
                onChange={(e) => handleFilterChange('department', e.target.value)}
              >
                <option value="">All Departments</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Electrical Engineering">Electrical Engineering</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Business Administration">Business Administration</option>
              </select>
            </div>

            <div className="col-md-3">
              <select
                className="form-select"
                value={filters.graduation_year}
                onChange={(e) => handleFilterChange('graduation_year', e.target.value)}
              >
                <option value="">All Graduation Years</option>
                {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <select
                className="form-select"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
              >
                <option value="">All Locations</option>
                <option value="Chennai">Chennai</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Delhi">Delhi</option>
              </select>
            </div>

            <div className="col-md-3">
              <select
                className="form-select"
                value={filters.available_for_mentorship}
                onChange={(e) => handleFilterChange('available_for_mentorship', e.target.value)}
              >
                <option value="">Mentorship Availability</option>
                <option value="true">Available for Mentorship</option>
                <option value="false">Not Available</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Alumni Table */}
      <div className="card">
        <div className="card-header bg-light">
          <div className="row align-items-center">
            <div className="col">
              <h4 className="mb-0">Alumni</h4>
            </div>
            <div className="col-auto">
              <span className="badge bg-primary rounded-pill">
                {isLoading ? '...' : `${totalAlumni} Alumni`}
              </span>
            </div>
          </div>
        </div>
        <div className="card-body">
          {isLoading ? (
            <LoadingSpinner message="Loading alumni..." />
          ) : error ? (
            <AlertMessage
              type="danger"
              message={error}
              onClose={() => setError(null)}
            />
          ) : !hasAlumni ? (
            <div className="text-center py-4">
              <p className="text-muted">No alumni found matching your criteria.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Graduation Year</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {alumni?.items?.map(alumnus => (
                    <tr key={alumnus.alumni_id}>
                      <td>
                        <Link to={`/admin/alumni/${alumnus.alumni_id}`}>
                          {alumnus.full_name}
                        </Link>
                      </td>
                      <td>{alumnus.email}</td>
                      <td>{alumnus.graduation_year || 'N/A'}</td>
                      <td>
                        <span className={`badge bg-${getVerificationBadgeColor(
                          alumnus.verification_status || 'pending'
                        )}`}>
                          {alumnus.verification_status || 'Pending'}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => navigate(`/admin/alumni/${alumnus.alumni_id}`)}
                        >
                          View
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteAlumni(alumnus.alumni_id.toString())}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!isLoading && hasAlumni && alumni && alumni.total > alumni.per_page && (
            <div className="d-flex justify-content-center mt-4">
              <nav>
                <ul className="pagination">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                  </li>
                  
                  {Array.from({ length: alumni.total_pages }, (_, i) => i + 1)
                    .filter(page => 
                      page === 1 || 
                      page === alumni.total_pages || 
                      Math.abs(page - currentPage) <= 2
                    )
                    .map((page, index, array) => {
                      // Show ellipsis where pages are skipped
                      if (index > 0 && page - array[index - 1] > 1) {
                        return (
                          <li key={`ellipsis-${page}`} className="page-item disabled">
                            <span className="page-link">...</span>
                          </li>
                        );
                      }
                      
                      return (
                        <li 
                          key={page} 
                          className={`page-item ${currentPage === page ? 'active' : ''}`}
                        >
                          <button 
                            className="page-link" 
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </button>
                        </li>
                      );
                    })}
                  
                  <li className={`page-item ${currentPage === alumni.total_pages ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, alumni.total_pages))}
                      disabled={currentPage === alumni.total_pages}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlumniList;