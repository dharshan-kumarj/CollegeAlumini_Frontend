import React, { useState, useEffect } from 'react';
import { AlumniProfile } from '../../types';

interface ProfileInfoFormProps {
  profile: AlumniProfile;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>; // Changed type to accommodate the "basic" wrapper
}

const ProfileInfoForm: React.FC<ProfileInfoFormProps> = ({ profile, onClose, onSubmit }) => {
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [currentLocation, setCurrentLocation] = useState('');
  const [availabilityForMentorship, setAvailabilityForMentorship] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setBio(profile.bio || '');
      setContactNumber(profile.contact_number || '');
      setCurrentLocation(profile.current_location || '');
      setAvailabilityForMentorship(profile.availability_for_mentorship || false);
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    try {
      // Format data to match the backend expectation with "basic" wrapper
      await onSubmit({
        basic: {
          full_name: fullName,
          bio: bio || null,
          contact_number: contactNumber || null,
          current_location: currentLocation || null,
          availability_for_mentorship: availabilityForMentorship
        }
      });
      onClose();
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Profile Information</h5>
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
                <label htmlFor="fullName" className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="bio" className="form-label">Bio (optional)</label>
                <textarea
                  className="form-control"
                  id="bio"
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="contactNumber" className="form-label">Contact Number (optional)</label>
                <input
                  type="tel"
                  className="form-control"
                  id="contactNumber"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="currentLocation" className="form-label">Current Location (optional)</label>
                <input
                  type="text"
                  className="form-control"
                  id="currentLocation"
                  value={currentLocation}
                  onChange={(e) => setCurrentLocation(e.target.value)}
                />
              </div>
              
              <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="availabilityForMentorship"
                  checked={availabilityForMentorship}
                  onChange={(e) => setAvailabilityForMentorship(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="availabilityForMentorship">
                  Available for Mentorship
                </label>
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

export default ProfileInfoForm;