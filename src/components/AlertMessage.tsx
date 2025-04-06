import React from 'react';

type AlertType = 'success' | 'danger' | 'warning' | 'info';

interface AlertMessageProps {
  type: AlertType;
  message: string;
  onClose?: () => void;
}

const AlertMessage: React.FC<AlertMessageProps> = ({ type, message, onClose }) => {
  if (!message) return null;
  
  return (
    <div className={`alert alert-${type} alert-dismissible fade show`} role="alert">
      {message}
      {onClose && (
        <button 
          type="button" 
          className="btn-close" 
          onClick={onClose} 
          aria-label="Close"
        ></button>
      )}
    </div>
  );
};

export default AlertMessage;