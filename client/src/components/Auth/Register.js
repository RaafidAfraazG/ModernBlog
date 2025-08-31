// client/src/components/Auth/Register.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import { useToast } from '../../hooks/useToast';
import Toast from '../UI/Toast';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toasts, showToast, removeToast } = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authAPI.register(formData);
      login(response.data.token, response.data.user);
      showToast(`Welcome to ModernBlog, ${response.data.user.username}! 🎉`);
      setTimeout(() => navigate('/'), 1000);
    } catch (error) {
      showToast(error.response?.data?.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
      
      <div className="card" style={{ maxWidth: '450px', margin: '50px auto', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ 
            fontSize: '32px',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            ✨ Join Us
          </h2>
          <p style={{ color: '#666' }}>Create your account and start blogging</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">👤 Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="form-input"
              placeholder="Choose a username"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">📧 Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">🔑 Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              placeholder="Create a strong password"
              required
            />
            <small style={{ color: '#666' }}>
              Minimum 6 characters
            </small>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-success"
            style={{ width: '100%', marginBottom: '20px' }}
          >
            {loading ? '✨ Creating Account...' : '🚀 Create Account'}
          </button>
          
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#666' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#667eea', fontWeight: '600' }}>
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </>
  );
};

export default Register;