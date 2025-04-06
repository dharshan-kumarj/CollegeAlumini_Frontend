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
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
            <div className="row g-2 mb-3">
              <div className="col-md-4">
                <label className="form-label">Department</label>
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
                  {filterCategories.departments?.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label">Graduation Year</label>
                <select
                  className="form-select"
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

              <div className="col-md-4">
                <label className="form-label">Min CGPA</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Minimum CGPA (e.g. 3.5)"
                  min="0"
                  max="4"
                  step="0.1"
                  value={filters.cgpa}
                  onChange={(e) => handleFilterChange('cgpa', e.target.value)}
                />
              </div>
            </div>

            <div className="row g-2 mb-3">
              <div className="col-md-6">
                <label className="form-label">Company</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Filter by company name"
                  value={filters.company_name}
                  onChange={(e) => handleFilterChange('company_name', e.target.value)}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Position</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Filter by job position"
                  value={filters.position}
                  onChange={(e) => handleFilterChange('position', e.target.value)}
                />
              </div>
            </div>

            <div className="d-flex justify-content-end">
              <button type="submit" className="btn btn-primary">
                Apply Filters
              </button>
              <button 
                type="button"
                className="btn btn-outline-secondary ms-2"
                onClick={clearFilters}
              >
                Clear All
              </button>
            </div>
          </form>
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
                {isLoading ? '...' : `${alumni?.total || 0} Alumni`}
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
                    {/* <th>Department</th>
                    <th>Current Company</th>
                    <th>Position</th>
                    <th>Status</th> */}
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
                      {/* <td>{alumnus.department || 'N/A'}</td>
                      <td>{alumnus.current_company || 'N/A'}</td>
                      <td>{alumnus.current_position || 'N/A'}</td> */}
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
                      type="button"
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
                            type="button"
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
                      type="button"
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