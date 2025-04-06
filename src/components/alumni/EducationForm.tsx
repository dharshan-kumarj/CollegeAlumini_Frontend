import React, { useState, useEffect } from 'react';
import { Education } from '../../types';

interface EducationFormProps {
  education: Education | null;
  onClose: () => void;
  onSubmit: (education: Omit<Education, 'id'>) => Promise<void>;
}

const EducationForm: React.FC<EducationFormProps> = ({ education, onClose, onSubmit }) => {
  const [degree, setDegree] = useState('');
  const [department, setDepartment] = useState('');
  const [institution, setInstitution] = useState('Our College');
  const [startYear, setStartYear] = useState(new Date().getFullYear() - 4);
  const [endYear, setEndYear] = useState(new Date().getFullYear());
  const [achievements, setAchievements] = useState('');
  const [cgpa, setCgpa] = useState<number | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (education) {
      setDegree(education.degree);
      setDepartment(education.department);
      setInstitution(education.institution || 'Our College');
      setStartYear(education.start_year);
      setEndYear(education.end_year);
      setAchievements(education.achievements || '');
      setCgpa(education.cgpa);
    }
  }, [education]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (endYear < startYear) {
      setError('End year cannot be earlier than start year');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit({
        degree,
        department,
        institution,
        start_year: startYear,
        end_year: endYear,
        achievements: achievements || undefined,
        cgpa: cgpa || undefined
      });
      onClose();
    } catch (err) {
      setError('Failed to save education. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{education ? 'Edit Education' : 'Add Education'}</h5>
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
                <label htmlFor="degree" className="form-label">Degree</label>
                <input
                  type="text"
                  className="form-control"
                  id="degree"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="department" className="form-label">Department</label>
                <input
                  type="text"
                  className="form-control"
                  id="department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="institution" className="form-label">Institution</label>
                <input
                  type="text"
                  className="form-control"
                  id="institution"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  required
                />
              </div>
              
              <div className="row mb-3">
                <div className="col">
                  <label htmlFor="startYear" className="form-label">Start Year</label>
                  <input
                    type="number"
                    className="form-control"
                    id="startYear"
                    value={startYear}
                    onChange={(e) => setStartYear(Number(e.target.value))}
                    required
                  />
                </div>
                <div className="col">
                  <label htmlFor="endYear" className="form-label">End Year</label>
                  <input
                    type="number"
                    className="form-control"
                    id="endYear"
                    value={endYear}
                    onChange={(e) => setEndYear(Number(e.target.value))}
                    required
                  />
                </div>
              </div>
              
              <div className="mb-3">
                <label htmlFor="cgpa" className="form-label">CGPA (optional)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  className="form-control"
                  id="cgpa"
                  value={cgpa || ''}
                  onChange={(e) => setCgpa(e.target.value ? Number(e.target.value) : undefined)}
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="achievements" className="form-label">Achievements (optional)</label>
                <textarea
                  className="form-control"
                  id="achievements"
                  rows={3}
                  value={achievements}
                  onChange={(e) => setAchievements(e.target.value)}
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

export default EducationForm;