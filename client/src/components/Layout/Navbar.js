// client/src/components/Layout/Navbar.js
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Helper function to check if link is active
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        {/* Logo Section */}
        <Link to="/" className="navbar-brand" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Logo Image - Replace src with your actual logo */}
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, var(--neon-yellow), var(--electric-green))',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '3px solid var(--pure-black)',
            fontSize: '20px',
            fontWeight: '900'
          }}>
            📝
          </div>
          {/* You can replace the div above with an actual image like this: */}
          {/* <img 
            src="C:\Users\Farhanaaz RS\Desktop\VistaBlog\client\src\components\Layout\Screenshot 2025-08-30 223913.png" 
            alt="ModernBlog Logo" 
            style={{ width: '40px', height: '40px', objectFit: 'contain' }}
          /> */}
          <span>ModernBlog</span>
        </Link>
        
        {/* Navigation Links */}
        <div className="navbar-links">
          {/* Public Links */}
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            🏠 Home
          </Link>
          
          {/* Authenticated User Links */}
          {user ? (
            <>
              <Link 
                to="/create" 
                className="btn btn-success"
                style={{ marginRight: '8px' }}
              >
                ✍️ New Post
              </Link>
              
              <Link 
                to="/profile" 
                className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
              >
                📝 My Posts
              </Link>

              {/* User Menu Dropdown */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="btn btn-secondary"
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    minWidth: 'auto',
                    position: 'relative'
                  }}
                >
                  {/* User Avatar */}
                  <div style={{
                    width: '28px',
                    height: '28px',
                    background: 'linear-gradient(135deg, var(--electric-green), var(--neon-yellow))',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: '900',
                    color: 'var(--pure-black)',
                    border: '2px solid var(--pure-black)'
                  }}>
                    {user.username ? user.username.charAt(0).toUpperCase() : '👤'}
                  </div>
                  <span style={{ fontSize: '0.9rem' }}>
                    {user.username}
                  </span>
                  <span style={{ 
                    fontSize: '12px',
                    transition: 'transform 0.2s ease',
                    transform: showUserMenu ? 'rotate(180deg)' : 'rotate(0deg)'
                  }}>
                    ▼
                  </span>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <>
                    {/* Backdrop to close menu */}
                    <div 
                      style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 999
                      }}
                      onClick={() => setShowUserMenu(false)}
                    />
                    
                    {/* Dropdown Content */}
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: '8px',
                      background: 'var(--pure-white)',
                      border: '3px solid var(--pure-black)',
                      borderRadius: 'var(--radius-lg)',
                      boxShadow: '6px 6px 0px var(--pure-black)',
                      minWidth: '200px',
                      zIndex: 1000,
                      overflow: 'hidden'
                    }}>
                      {/* User Info Header */}
                      <div style={{
                        padding: '16px',
                        background: 'var(--ultra-light-gray)',
                        borderBottom: '2px solid var(--pure-black)'
                      }}>
                        <div style={{ fontWeight: '800', fontSize: '0.9rem', marginBottom: '4px' }}>
                          👋 Hello!
                        </div>
                        <div style={{ 
                          fontSize: '0.8rem', 
                          color: 'var(--medium-gray)',
                          fontWeight: '600'
                        }}>
                          {user.email}
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div style={{ padding: '8px' }}>
                        <Link
                          to="/profile"
                          className="dropdown-item"
                          onClick={() => setShowUserMenu(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px 16px',
                            textDecoration: 'none',
                            color: 'var(--pure-black)',
                            borderRadius: 'var(--radius-md)',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = 'var(--neon-yellow)';
                            e.target.style.transform = 'translateX(4px)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = 'transparent';
                            e.target.style.transform = 'translateX(0px)';
                          }}
                        >
                          👤 My Profile
                        </Link>

                        <Link
                          to="/create"
                          className="dropdown-item"
                          onClick={() => setShowUserMenu(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px 16px',
                            textDecoration: 'none',
                            color: 'var(--pure-black)',
                            borderRadius: 'var(--radius-md)',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = 'var(--electric-green)';
                            e.target.style.transform = 'translateX(4px)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = 'transparent';
                            e.target.style.transform = 'translateX(0px)';
                          }}
                        >
                          ✍️ Write Post
                        </Link>

                        <button
                          onClick={handleLogout}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '12px 16px',
                            background: 'transparent',
                            border: 'none',
                            color: '#ff3366',
                            borderRadius: 'var(--radius-md)',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            width: '100%',
                            textAlign: 'left'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = '#ff3366';
                            e.target.style.color = 'var(--pure-white)';
                            e.target.style.transform = 'translateX(4px)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = 'transparent';
                            e.target.style.color = '#ff3366';
                            e.target.style.transform = 'translateX(0px)';
                          }}
                        >
                          🚪 Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            /* Guest User Links */
            <>
              <Link 
                to="/login" 
                className="btn btn-primary"
                style={{ marginRight: '8px' }}
              >
                🔐 Login
              </Link>
              <Link 
                to="/register" 
                className="btn btn-success"
              >
                🚀 Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu Toggle - Add this CSS to your index.css if needed */}
      <style jsx>{`
        @media (max-width: 768px) {
          .navbar-content {
            flex-direction: row !important;
            justify-content: space-between !important;
          }
          
          .navbar-links {
            flex-direction: row !important;
            flex-wrap: wrap !important;
            gap: 8px !important;
          }
          
          .navbar-brand span {
            display: none;
          }
          
          .nav-link {
            padding: 8px 12px !important;
            font-size: 0.8rem !important;
          }
          
          .btn {
            padding: 8px 12px !important;
            font-size: 0.8rem !important;
          }
        }
        
        @media (max-width: 480px) {
          .navbar-links {
            gap: 4px !important;
          }
          
          .btn, .nav-link {
            padding: 6px 8px !important;
            font-size: 0.75rem !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;