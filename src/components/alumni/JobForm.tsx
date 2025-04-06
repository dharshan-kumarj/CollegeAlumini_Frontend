import React, { useState, useEffect } from 'react';
import { Job } from '../../types';

interface JobFormProps {
  job: Job | null;
  onClose: () => void;
  onSubmit: (job: Omit<Job, 'id'>) => Promise<void>;
}

const JobForm: React.FC<JobFormProps> = ({ job, onClose, onSubmit }) => {
  const [companyName, setCompanyName] = useState('');
  const [position, setPosition] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isCurrent, setIsCurrent] = useState(true);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (job) {
      setCompanyName(job.company_name);
      setPosition(job.position);
      setLocation(job.location);
      setStartDate(job.start_date);
      setEndDate(job.end_date || '');
      setIsCurrent(job.is_current);
      setDescription(job.description || '');
    } else {
      // Set today as default start date for new job entries
      const today = new Date();
      setStartDate(today.toISOString().split('T')[0]);
    }
  }, [job]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validation
    if (isCurrent === false && !endDate) {
      setError('End date is required if this is not your current job');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit({
        company_name: companyName,
        position,
        location,
        start_date: startDate,
        end_date: isCurrent ? undefined : endDate,
        is_current: isCurrent,
        description: description || undefined
      });
      onClose();
    } catch (err) {
      setError('Failed to save job information. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{job ? 'Edit Job' : 'Add Job'}</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          
          <div className="modal-body">
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="position" className="form-label">Position</label>
                <input
                  type="text"
                  className="form-control"
                  id="position"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="companyName" className="form-label">Company Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="location" className="form-label">Location</label>
                <input
                  type="text"
                  className="form-control"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="startDate" className="form-label">Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              
              <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="isCurrent"
                  checked={isCurrent}
                  onChange={(e) => setIsCurrent(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="isCurrent">
                  This is my current job
                </label>
              </div>
              
              {!isCurrent && (
                <div className="mb-3">
                  <label htmlFor="endDate" className="form-label">End Date</label>
                  <input
                    type="date"
                    className="form-control"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
              )}
              
              <div className="mb-3">
                <label htmlFor="description" className="form-label">Description (optional)</label>
                <textarea
                  className="form-control"
                  id="description"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              
              <div className="modal-footer px-0 pb-0">
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobForm;