// client/src/components/UI/Toast.js
import React, { useState, useEffect } from 'react';

const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose && onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000,
        padding: '16px 20px',
        borderRadius: '8px',
        color: 'white',
        background: type === 'success' 
          ? 'linear-gradient(135deg, #56ab2f, #a8e6cf)'
          : 'linear-gradient(135deg, #ff416c, #ff4b2b)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        animation: 'slideIn 0.3s ease-out'
      }}
    >
      {message}
      <button
        onClick={() => {
          setVisible(false);
          onClose && onClose();
        }}
        style={{
          background: 'none',
          border: 'none',
          color: 'white',
          marginLeft: '12px',
          cursor: 'pointer',
          fontSize: '18px'
        }}
      >
        ×
      </button>
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default Toast;