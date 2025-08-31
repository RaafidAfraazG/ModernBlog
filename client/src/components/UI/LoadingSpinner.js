// client/src/components/UI/LoadingSpinner.js
import React from 'react';

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="loading">
      <div style={{ textAlign: 'center' }}>
        <div style={{ 
          fontSize: '40px', 
          marginBottom: '16px',
          animation: 'spin 2s linear infinite'
        }}>
          ⏳
        </div>
        <p>{message}</p>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default LoadingSpinner;