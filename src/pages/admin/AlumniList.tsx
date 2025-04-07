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
  
  // Updated filters based on the backend API endpoints
  const [filters, setFilters] = useState<Record<string, string>>({
    department: '',
    end_year: '',
    cgpa: '',
    company_name: '',
    position: '',
    full_name: ''
  });

  // Fetch category data for filter dropdowns
  const [filterCategories, setFilterCategories] = useState({
    departments: [],
    companies: [],
    positions: []
  });

  const fetchFilterCategories = async () => {
    try {
      const response = await admin.getFilterCategories();
      setFilterCategories(response.data);
    } catch (err) {
      console.error('Failed to load filter categories:', err);
    }
  };

  const fetchAlumni = async (page: number) => {
    try {
      setIsLoading(true);
      
      // Create a filter object with only non-empty values
      const activeFilters: Record<string, string> = {};
      Object.entries(filters).forEach(([key, value]) => {
        if (value) activeFilters[key] = value;
      });
      
      // Add search term as full_name filter if not empty
      if (searchTerm) {
        activeFilters.full_name = searchTerm;
      }
      
      // Check if we have any active filters
      let response;
      if (Object.keys(activeFilters).length > 0) {
        // Use the filter endpoint with query parameters
        response = await admin.filterAlumni({
          ...activeFilters,
          page: page.toString(),
          per_page: '10'
        });
      } else {
        // Use the regular get all alumni endpoint
        response = await admin.getAllAlumni(page);
      }
      
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
    fetchFilterCategories();
    fetchAlumni(currentPage);
  }, [currentPage]);
  
  // Don't automatically trigger fetch when filters change - wait for user to submit
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Reset to first page when searching
    setCurrentPage(1);
    fetchAlumni(1);
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchAlumni(1);
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      department: '',
      end_year: '',
      cgpa: '',
      company_name: '',
      position: '',
      full_name: ''
    });
    setCurrentPage(1);
    fetchAlumni(1);
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

  // Generate graduation year options
  const graduationYears = Array.from(
    { length: 10 }, 
    (_, i) => new Date().getFullYear() - i
  );

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-white">Alumni Directory</h2>
        <span className="badge bg-primary fs-6 py-2 px-3">
          {isLoading ? 'Loading...' : `${alumni?.total || 0} Alumni`}
        </span>
      </div>

      {/* Search and Filter Controls */}
      <div className="card bg-dark border-0 shadow-sm mb-4">
        <div className="card-header bg-dark border-bottom border-secondary">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="text-white mb-0">
              <i className="bi bi-funnel-fill me-2 text-primary"></i>
              Search & Filters
            </h5>
            <button 
              type="button"
              className="btn btn-sm btn-outline-secondary"
              data-bs-toggle="collapse" 
              data-bs-target="#filterCollapse"
              aria-expanded="true" 
              aria-controls="filterCollapse"
            >
              <i className="bi bi-chevron-up"></i>
            </button>
          </div>
        </div>
        <div className="collapse show" id="filterCollapse">
          <div className="card-body bg-dark">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="input-group">
                <span className="input-group-text bg-dark-subtle border-secondary text-light">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search alumni by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Search alumni"
                />
                <button className="btn btn-primary" type="submit">
                  Search
                </button>
                <button 
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={clearFilters}
                >
                  Clear
                </button>
              </div>
            </form>

            <form onSubmit={handleFilterSubmit}>
              <div className="row g-3 mb-4">
                <div className="col-md-4">
                  <label className="form-label text-light">Department</label>
                  <div className="input-group">
                    <span className="input-group-text bg-dark-subtle border-secondary text-light">
                      <i className="bi bi-building"></i>
                    </span>
                    <select
                      className="form-select bg-dark text-light border-secondary"
                      value={filters.department}
                      onChange={(e) => handleFilterChange('department', e.target.value)}
                    >
                      <option value="">All Departments</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Electrical Engineering">Electrical Engineering</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="Civil Engineering">Civil Engineering</option>
                      <option value="Business Administration">Business Administration</option>
                      {filterCategories.departments?.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="col-md-4">
                  <label className="form-label text-light">Graduation Year</label>
                  <div className="input-group">
                    <span className="input-group-text bg-dark-subtle border-secondary text-light">
                      <i className="bi bi-calendar-event"></i>
                    </span>
                    <select
                      className="form-select bg-dark text-light border-secondary"
                      value={filters.end_year}
                      onChange={(e) => handleFilterChange('end_year', e.target.value)}
                    >
                      <option value="">All Years</option>
                      {graduationYears.map(year => (
                        <option key={year} value={year.toString()}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="col-md-4">
                  <label className="form-label text-light">Min CGPA</label>
                  <div className="input-group">
                    <span className="input-group-text bg-dark-subtle border-secondary text-light">
                      <i className="bi bi-award"></i>
                    </span>
                    <input
                      type="number"
                      className="form-control bg-dark text-light border-secondary"
                      placeholder="Minimum CGPA (e.g. 3.5)"
                      min="0"
                      max="4"
                      step="0.1"
                      value={filters.cgpa}
                      onChange={(e) => handleFilterChange('cgpa', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label text-light">Company</label>
                  <div className="input-group">
                    <span className="input-group-text bg-dark-subtle border-secondary text-light">
                      <i className="bi bi-briefcase"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control bg-dark text-light border-secondary"
                      placeholder="Filter by company name"
                      value={filters.company_name}
                      onChange={(e) => handleFilterChange('company_name', e.target.value)}
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label text-light">Position</label>
                  <div className="input-group">
                    <span className="input-group-text bg-dark-subtle border-secondary text-light">
                      <i className="bi bi-person-badge"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control bg-dark text-light border-secondary"
                      placeholder="Filter by job position"
                      value={filters.position}
                      onChange={(e) => handleFilterChange('position', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-end">
                <button type="submit" className="btn btn-primary">
                  <i className="bi bi-funnel me-2"></i>
                  Apply Filters
                </button>
                <button 
                  type="button"
                  className="btn btn-outline-secondary ms-2"
                  onClick={clearFilters}
                >
                  <i className="bi bi-x-circle me-2"></i>
                  Clear All
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Alumni Table */}
      <div className="card bg-dark border-0 shadow">
        <div className="card-header bg-dark border-bottom border-secondary">
          <div className="row align-items-center">
            <div className="col">
              <h5 className="mb-0 text-white">
                <i className="bi bi-people-fill me-2 text-primary"></i>
                Alumni List
              </h5>
            </div>
            <div className="col-auto">
              {!isLoading && hasAlumni && (
                <span className="text-muted small">
                  Showing {((currentPage - 1) * (alumni?.per_page || 10)) + 1} to {Math.min(currentPage * (alumni?.per_page || 10), alumni?.total || 0)} of {alumni?.total || 0}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="card-body bg-dark p-0">
          {isLoading ? (
            <div className="p-4 text-center">
              <LoadingSpinner message="Loading alumni data..." />
            </div>
          ) : error ? (
            <div className="p-4">
              <AlertMessage
                type="danger"
                message={error}
                onClose={() => setError(null)}
              />
            </div>
          ) : !hasAlumni ? (
            <div className="text-center py-5">
              <i className="bi bi-search text-muted display-1 mb-3"></i>
              <h5 className="text-white">No Alumni Found</h5>
              <p className="text-muted mb-0">No alumni records match your search criteria.</p>
              <button className="btn btn-outline-primary mt-3" onClick={clearFilters}>
                <i className="bi bi-arrow-counterclockwise me-2"></i>
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-dark table-hover border-secondary mb-0">
                <thead className="bg-dark-subtle text-light">
                  <tr>
                    <th scope="col" className="border-secondary">Name</th>
                    <th scope="col" className="border-secondary">Email</th>
                    <th scope="col" className="border-secondary">Graduation</th>
                    <th scope="col" className="border-secondary">Department</th>
                    <th scope="col" className="border-secondary">Company</th>
                    <th scope="col" className="border-secondary">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {alumni?.items?.map(alumnus => (
                    <tr key={alumnus.alumni_id} className="border-secondary">
                      <td className="border-secondary">
                        <div className="d-flex align-items-center">
                          <div className={alumnus.profile_image ? '' : 'bg-primary bg-opacity-25 rounded-circle p-2 me-2 text-center'} style={{width: '36px', height: '36px'}}>
                            {alumnus.profile_image ? (
                              <img 
                                src={alumnus.profile_image} 
                                alt={alumnus.full_name} 
                                className="rounded-circle"
                                width="36"
                                height="36"
                              />
                            ) : (
                              <i className="bi bi-person-fill text-primary"></i>
                            )}
                          </div>
                          <Link to={`/admin/alumni/${alumnus.alumni_id}`} className="text-decoration-none ms-2 text-white fw-medium">
                            {alumnus.full_name}
                          </Link>
                        </div>
                      </td>
                      <td className="text-muted border-secondary">{alumnus.email}</td>
                      <td className="text-muted border-secondary">{alumnus.graduation_year || 'N/A'}</td>
                      <td className="text-muted border-secondary">{alumnus.department || 'N/A'}</td>
                      <td className="text-muted border-secondary">{alumnus.current_company || 'N/A'}</td>
                      <td className="border-secondary">
                        <div className="d-flex">
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => navigate(`/admin/alumni/${alumnus.alumni_id}`)}
                            title="View Profile"
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteAlumni(alumnus.alumni_id.toString())}
                            title="Delete Profile"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!isLoading && hasAlumni && alumni && alumni.total > alumni.per_page && (
            <div className="bg-dark p-3 border-top border-secondary">
              <nav>
                <ul className="pagination justify-content-center mb-0">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button
                      className="page-link bg-dark text-light border-secondary"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      type="button"
                    >
                      <i className="bi bi-chevron-left small"></i>
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
                            <span className="page-link bg-dark text-light border-secondary">...</span>
                          </li>
                        );
                      }
                      
                      return (
                        <li 
                          key={page} 
                          className={`page-item ${currentPage === page ? 'active' : ''}`}
                        >
                          <button 
                            className={`page-link border-secondary ${currentPage === page ? 'bg-primary text-white' : 'bg-dark text-light'}`}
                            onClick={() => setCurrentPage(page)}
                            type="button"
                          >
                            {page}
                          </button>
                        </li>
                      );
                    })}
                  
                  <li className={`page-item ${currentPage === alumni.total_pages ? 'disabled' : ''}`}>
                    <button
                      className="page-link bg-dark text-light border-secondary"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, alumni.total_pages))}
                      disabled={currentPage === alumni.total_pages}
                      type="button"
                    >
                      <i className="bi bi-chevron-right small"></i>
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