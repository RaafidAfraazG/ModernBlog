// client/src/components/Profile/Profile.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { postsAPI } from '../../services/api';
import LoadingSpinner from '../UI/LoadingSpinner';
import { useToast } from '../../hooks/useToast';
import Toast from '../UI/Toast';

// Custom Delete Confirmation Modal
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, postTitle, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px'
    }}>
      <div className="card" style={{
        maxWidth: '500px', width: '100%', padding: '30px', textAlign: 'center',
        border: '3px solid var(--electric-red)', animation: 'slideIn 0.3s ease'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚠️</div>
        
        <h3 style={{ 
          marginBottom: '15px', 
          fontFamily: 'Space Grotesk, sans-serif',
          color: 'var(--electric-red)'
        }}>
          Delete Post?
        </h3>
        
        <p style={{ 
          marginBottom: '25px', 
          color: 'var(--medium-gray)',
          fontSize: '16px',
          lineHeight: '1.5'
        }}>
          Are you sure you want to delete <strong>"{postTitle}"</strong>?
          <br />
          <span style={{ color: 'var(--electric-red)', fontWeight: 'bold' }}>
            This action cannot be undone.
          </span>
        </p>
        
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button 
            onClick={onClose}
            className="btn btn-secondary"
            disabled={isLoading}
            style={{ minWidth: '120px' }}
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="btn btn-danger"
            disabled={isLoading}
            style={{ minWidth: '120px' }}
          >
            {isLoading ? 'Deleting...' : 'Delete Post'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Bulk Delete Confirmation Modal
const BulkDeleteConfirmationModal = ({ isOpen, onClose, onConfirm, postCount, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px'
    }}>
      <div className="card" style={{
        maxWidth: '500px', width: '100%', padding: '30px', textAlign: 'center',
        border: '3px solid var(--electric-red)', animation: 'slideIn 0.3s ease'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>🗑️</div>
        
        <h3 style={{ 
          marginBottom: '15px', 
          fontFamily: 'Space Grotesk, sans-serif',
          color: 'var(--electric-red)'
        }}>
          Delete {postCount} Posts?
        </h3>
        
        <p style={{ 
          marginBottom: '25px', 
          color: 'var(--medium-gray)',
          fontSize: '16px',
          lineHeight: '1.5'
        }}>
          Are you sure you want to delete <strong>{postCount} selected posts</strong>?
          <br />
          <span style={{ color: 'var(--electric-red)', fontWeight: 'bold' }}>
            This action cannot be undone.
          </span>
        </p>
        
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button 
            onClick={onClose}
            className="btn btn-secondary"
            disabled={isLoading}
            style={{ minWidth: '120px' }}
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="btn btn-danger"
            disabled={isLoading}
            style={{ minWidth: '120px' }}
          >
            {isLoading ? 'Deleting...' : `Delete ${postCount} Posts`}
          </button>
        </div>
      </div>
    </div>
  );
};

// Edit Profile Modal Component
const EditProfileModal = ({ user, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    username: user.username || '',
    email: user.email || '',
    bio: user.bio || '',
    location: user.location || '',
    website: user.website || ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px'
    }}>
      <div className="form-container" style={{
        maxWidth: '500px', width: '100%', maxHeight: '90vh', overflowY: 'auto', margin: 0
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h2 style={{ margin: 0, fontFamily: 'Space Grotesk, sans-serif' }}>Edit Profile</h2>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: 'var(--medium-gray)' }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text" name="username" value={formData.username} onChange={handleChange}
              className="form-input" required minLength={3} maxLength={20}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email" name="email" value={formData.email} onChange={handleChange}
              className="form-input" required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Bio</label>
            <textarea
              name="bio" value={formData.bio} onChange={handleChange}
              className="form-textarea" placeholder="Tell us about yourself..." maxLength={250}
            />
            <small style={{ color: 'var(--medium-gray)' }}>{formData.bio.length}/250 characters</small>
          </div>

          <div className="form-group">
            <label className="form-label">Location</label>
            <input
              type="text" name="location" value={formData.location} onChange={handleChange}
              className="form-input" placeholder="Where are you based?" maxLength={50}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Website</label>
            <input
              type="url" name="website" value={formData.website} onChange={handleChange}
              className="form-input" placeholder="https://yourwebsite.com"
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '30px' }}>
            <button type="submit" className="btn btn-success" disabled={isLoading} style={{ flex: 1 }}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Enhanced Profile Header
const ProfileHeader = ({ user, posts, profileStats, onEditProfile }) => {
  return (
    <div className="hero" style={{ marginBottom: '40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '30px', marginBottom: '30px' }}>
        <div style={{
          fontSize: '120px',
          background: 'linear-gradient(135deg, var(--neon-yellow), var(--electric-green))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(2px 2px 0px var(--pure-black))'
        }}>
          👤
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{
            fontSize: '3.5rem', marginBottom: '10px', fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em'
          }}>
            {user.username}
          </h1>
          <p style={{ color: 'var(--medium-gray)', fontSize: '1.2rem', fontWeight: 600, marginBottom: user.bio ? '10px' : '20px' }}>
            {user.email}
          </p>

          {user.bio && (
            <p style={{ color: 'var(--pure-black)', fontSize: '1rem', fontWeight: 500, marginBottom: '15px', fontStyle: 'italic' }}>
              "{user.bio}"
            </p>
          )}

          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
            {user.location && (
              <div className="category-tag" style={{ background: 'var(--electric-green)' }}>
                {user.location}
              </div>
            )}
            {user.website && (
              <a
                href={user.website} target="_blank" rel="noopener noreferrer"
                className="category-tag"
                style={{ background: 'var(--bright-lime)', textDecoration: 'none', color: 'var(--pure-black)' }}
              >
                Website
              </a>
            )}
            <div className="category-tag">Joined {new Date(user.createdAt || Date.now()).toLocaleDateString()}</div>
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <button onClick={onEditProfile} className="btn btn-primary" style={{ fontSize: '0.9rem' }}>
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-container" style={{ marginTop: '30px' }}>
        <div className="stat-card">
          <div className="stat-number">{posts.length}</div>
          <div className="stat-label">Total Posts</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{profileStats.totalWords}</div>
          <div className="stat-label">Words Written</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{profileStats.postsToday}</div>
          <div className="stat-label">Posts Today</div>
        </div>
        <div className="stat-card" style={{ background: '#ff3366' }}>
          <div className="stat-number">{profileStats.thisWeek}</div>
          <div className="stat-label">This Week</div>
        </div>
        <div className="stat-card" style={{ background: 'var(--bright-lime)' }}>
          <div className="stat-number">{profileStats.thisMonth}</div>
          <div className="stat-label">This Month</div>
        </div>
        <div className="stat-card" style={{ background: '#764ba2' }}>
          <div className="stat-number" style={{ color: 'var(--pure-white)' }}>{profileStats.avgWordsPerPost}</div>
          <div className="stat-label" style={{ color: 'var(--pure-white)' }}>Avg Words/Post</div>
        </div>
      </div>
    </div>
  );
};

// Filter and Sort Controls
const PostsControls = ({
  searchTerm, setSearchTerm,
  sortBy, setSortBy,
  filterBy, setFilterBy,
  viewMode, setViewMode,
  showToast
}) => {
  return (
    <div className="card" style={{ padding: '25px', marginBottom: '30px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center' }}>
        {/* Search */}
        <div style={{ flex: '1', minWidth: '200px' }}>
          <input
            type="text"
            placeholder="Search your posts..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (e.target.value && showToast) {
                showToast(`Searching for "${e.target.value}"`, 'info');
              }
            }}
            className="search-input"
            style={{ marginBottom: '0' }}
          />
        </div>

        {/* Sort By */}
        <div>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              const sortLabels = {
                newest: 'Newest First',
                oldest: 'Oldest First',
                title: 'Title A-Z',
                wordCount: 'Word Count',
                updated: 'Recently Updated'
              };
              showToast && showToast(`Sorted by ${sortLabels[e.target.value]}`, 'info');
            }}
            className="form-input"
            style={{ minWidth: '150px' }}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title">Title A-Z</option>
            <option value="wordCount">Word Count</option>
            <option value="updated">Recently Updated</option>
          </select>
        </div>

        {/* Filter By */}
        <div>
          <select
            value={filterBy}
            onChange={(e) => {
              setFilterBy(e.target.value);
              const filterLabels = {
                all: 'All Posts',
                today: "Today's Posts",
                week: 'This Week',
                month: 'This Month',
                withImages: 'Posts with Images',
                longPosts: 'Long Posts (500+ words)'
              };
              showToast && showToast(`Filtered: ${filterLabels[e.target.value]}`, 'info');
            }}
            className="form-input"
            style={{ minWidth: '150px' }}
          >
            <option value="all">All Posts</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="withImages">With Images</option>
            <option value="longPosts">Long Posts (500+ words)</option>
          </select>
        </div>

        {/* View Mode Toggle */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => { setViewMode('grid'); showToast && showToast('Switched to Grid view', 'success'); }}
            className={`btn ${viewMode === 'grid' ? 'btn-success' : 'btn-secondary'}`}
            style={{ minWidth: 'auto', padding: '8px 12px' }}
          >
            Grid
          </button>
          <button
            onClick={() => { setViewMode('list'); showToast && showToast('Switched to List view', 'success'); }}
            className={`btn ${viewMode === 'list' ? 'btn-success' : 'btn-secondary'}`}
            style={{ minWidth: 'auto', padding: '8px 12px' }}
          >
            List
          </button>
        </div>
      </div>
    </div>
  );
};

// Enhanced Post Card
const ProfilePostCard = ({ post, onDelete, onDuplicate, viewMode }) => {
  const [showFullContent, setShowFullContent] = useState(false);
  const safeContent = post.content || '';
  const wordCount = safeContent.split(' ').length;
  const readingTime = Math.ceil(wordCount / 200);

  const handleDelete = () => onDelete(post._id, post.title);
  const handleDuplicate = () => onDuplicate(post);

  // Get the image URL - check both uploaded image and URL-based image
  const getImageUrl = () => {
    if (post.image && post.image.url) {
      return post.image.url; // Uploaded image from Cloudinary
    }
    return post.imageURL; // URL-based image
  };

  const imageUrl = getImageUrl();

  const cardClass = viewMode === 'list' ? 'card' : 'card post-card';
  const cardStyle = viewMode === 'list'
    ? { padding: '20px', marginBottom: '20px', transform: 'none' }
    : {};

  return (
    <div className={cardClass} style={cardStyle}>
      {imageUrl && viewMode === 'grid' && (
        <img src={imageUrl} alt={post.title} className="post-image" />
      )}

      <div className={viewMode === 'grid' ? 'post-content' : ''}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
          <h3 className="post-title" style={{ margin: 0, flex: 1 }}>
            <Link to={`/post/${post._id}`}>{post.title}</Link>
          </h3>
          {viewMode === 'list' && imageUrl && (
            <img
              src={imageUrl}
              alt={post.title}
              style={{
                width: '80px', height: '80px', objectFit: 'cover',
                borderRadius: 'var(--radius-md)', border: '2px solid var(--pure-black)', marginLeft: '20px'
              }}
            />
          )}
        </div>

        {/* Meta */}
        <div className="post-meta" style={{ marginBottom: '15px' }}>
          <span className="post-date">{new Date(post.createdAt).toLocaleDateString()}</span>
          {post.updatedAt !== post.createdAt && (
            <>
              <span>•</span>
              <span>Updated {new Date(post.updatedAt).toLocaleDateString()}</span>
            </>
          )}
          <span>•</span><span>{wordCount} words</span>
          <span>•</span><span>{readingTime} min read</span>
        </div>

        {/* Content */}
        <div className="post-excerpt" style={{ marginBottom: '20px' }}>
          {showFullContent
            ? safeContent
            : `${safeContent.substring(0, viewMode === 'list' ? 200 : 100)}...`}
          {safeContent.length > (viewMode === 'list' ? 200 : 100) && (
            <button
              onClick={() => setShowFullContent(!showFullContent)}
              style={{
                background: 'none', border: 'none', color: 'var(--electric-green)',
                cursor: 'pointer', fontWeight: 'bold', marginLeft: '10px'
              }}
            >
              {showFullContent ? 'Show Less' : 'Show More'}
            </button>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Link to={`/post/${post._id}`} className="btn btn-secondary" style={{ flex: '1', minWidth: '100px', textAlign: 'center' }}>
            View
          </Link>
          <Link to={`/edit/${post._id}`} className="btn btn-primary" style={{ flex: '1', minWidth: '100px', textAlign: 'center' }}>
            Edit
          </Link>
          <button onClick={handleDuplicate} className="btn btn-success" style={{ flex: '1', minWidth: '100px' }}>
            Duplicate
          </button>
          <button onClick={handleDelete} className="btn btn-danger" style={{ flex: '1', minWidth: '100px' }}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// Posts List
const ProfilePostsList = ({ posts, onDelete, onDuplicate, searchTerm, sortBy, filterBy, viewMode }) => {
  const filteredPosts = posts.filter(post => {
    const term = (searchTerm || '').toLowerCase();
    const title = (post.title || '').toLowerCase();
    const content = (post.content || '').toLowerCase();

    if (term && !title.includes(term) && !content.includes(term)) return false;

    const now = new Date();
    const postDate = new Date(post.createdAt);

    switch (filterBy) {
      case 'today':
        return postDate.toDateString() === now.toDateString();
      case 'week':
        return postDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case 'month':
        return postDate.getMonth() === now.getMonth() && postDate.getFullYear() === now.getFullYear();
      case 'withImages':
        return !!(post.imageURL || (post.image && post.image.url));
      case 'longPosts':
        return (post.content || '').split(' ').length >= 500;
      default:
        return true;
    }
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'title':
        return (a.title || '').localeCompare(b.title || '');
      case 'wordCount':
        return (b.content || '').split(' ').length - (a.content || '').split(' ').length;
      case 'updated':
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  if (posts.length === 0) {
    return (
      <div className="empty-state">
        <h3>No posts yet</h3>
        <p>Start sharing your thoughts with the world!</p>
        <Link to="/create" className="btn btn-success" style={{ marginTop: '20px' }}>
          Create Your First Post
        </Link>
      </div>
    );
  }

  if (sortedPosts.length === 0) {
    return (
      <div className="empty-state">
        <h3>No posts found</h3>
        <p>Try adjusting your search or filters.</p>
      </div>
    );
  }

  const containerClass = viewMode === 'grid' ? 'posts-grid' : '';

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <p style={{ color: 'var(--medium-gray)', fontWeight: 600 }}>
          Showing {sortedPosts.length} of {posts.length} posts
        </p>
      </div>

      <div className={containerClass}>
        {sortedPosts.map(post => (
          <ProfilePostCard
            key={post._id}
            post={post}
            onDelete={onDelete}
            onDuplicate={onDuplicate}
            viewMode={viewMode}
          />
        ))}
      </div>
    </>
  );
};

// Profile Actions
const ProfileActions = ({ onExportPosts, onBulkDelete, selectedPosts }) => {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      marginBottom: '30px', flexWrap: 'wrap', gap: '15px'
    }}>
      <h2 style={{ margin: 0, fontSize: '2.5rem', fontFamily: 'Space Grotesk, sans-serif' }}>My Posts</h2>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <Link to="/create" className="btn btn-success">New Post</Link>
        <button onClick={onExportPosts} className="btn btn-secondary">Export Posts</button>
        {selectedPosts.length > 0 && (
          <button onClick={onBulkDelete} className="btn btn-danger">
            Delete Selected ({selectedPosts.length})
          </button>
        )}
      </div>
    </div>
  );
};

// Login Required
const LoginRequired = () => {
  return (
    <div className="empty-state">
      <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔒</div>
      <h3>Login Required</h3>
      <p>Please log in to view your profile.</p>
      <Link to="/login" className="btn btn-primary" style={{ marginTop: '20px' }}>
        Login Now
      </Link>
    </div>
  );
};

// Main Profile
const Profile = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  
  // Delete confirmation modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { user, token, updateUser } = useAuth();
  const navigate = useNavigate();
  const { toasts, showToast, removeToast } = useToast();

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const response = await postsAPI.getUserPosts(token);
        setPosts(response.data);
      } catch (error) {
        setError('Failed to fetch your posts');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      setUserProfile(user);
      fetchUserPosts();
    }
  }, [user, token]);

  const profileStats = {
    totalWords: posts.reduce((sum, post) => sum + (post.content || '').split(' ').length, 0),
    postsToday: posts.filter(post =>
      new Date(post.createdAt).toDateString() === new Date().toDateString()
    ).length,
    thisWeek: posts.filter(post => {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return new Date(post.createdAt) >= weekAgo;
    }).length,
    thisMonth: posts.filter(post => {
      const now = new Date();
      const postDate = new Date(post.createdAt);
      return postDate.getMonth() === now.getMonth() && postDate.getFullYear() === now.getFullYear();
    }).length,
    avgWordsPerPost: posts.length > 0
      ? Math.round(posts.reduce((sum, post) => sum + (post.content || '').split(' ').length, 0) / posts.length)
      : 0
  };

  // Updated handleDelete function with custom modal
  const handleDelete = (postId, postTitle) => {
    setPostToDelete({ id: postId, title: postTitle });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!postToDelete) return;
    
    setDeleteLoading(true);
    try {
      await postsAPI.deletePost(postToDelete.id, token);
      setPosts(posts.filter(post => post._id !== postToDelete.id));
      showToast('Post deleted successfully!');
      setShowDeleteModal(false);
      setPostToDelete(null);
    } catch (error) {
      showToast('Failed to delete post', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDuplicate = async (post) => {
    try {
      const duplicatedPost = {
        title: `${post.title} (Copy)`,
        content: post.content,
        imageURL: post.imageURL
      };
      navigate('/create', { state: { duplicatedPost } });
      showToast('Post ready for duplication!');
    } catch (error) {
      showToast('Failed to duplicate post', 'error');
    }
  };

  const handleExportPosts = () => {
    try {
      const exportData = {
        user: userProfile,
        posts: posts,
        stats: profileStats,
        exportDate: new Date().toISOString(),
        totalPosts: posts.length
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      const exportFileDefaultName = `${userProfile.username}-posts-export-${new Date().toISOString().split('T')[0]}.json`;

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();

      showToast(`${posts.length} posts exported successfully!`);
    } catch (error) {
      showToast('Failed to export posts', 'error');
    }
  };

  // Updated handleBulkDelete function with custom modal
  const handleBulkDelete = () => {
    setShowBulkDeleteModal(true);
  };

  const confirmBulkDelete = async () => {
    setDeleteLoading(true);
    try {
      for (const postId of selectedPosts) {
        await postsAPI.deletePost(postId, token);
      }
      setPosts(posts.filter(post => !selectedPosts.includes(post._id)));
      setSelectedPosts([]);
      showToast(`${selectedPosts.length} posts deleted successfully!`);
      setShowBulkDeleteModal(false);
    } catch (error) {
      showToast('Failed to delete posts', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEditProfile = () => setShowEditModal(true);

  const handleSaveProfile = async (formData) => {
    try {
      const updatedUser = { ...userProfile, ...formData };
      setUserProfile(updatedUser);
      if (updateUser) updateUser(updatedUser);
      showToast('Profile updated successfully!');
      setShowEditModal(false);
    } catch (error) {
      showToast('Failed to update profile. Please try again.', 'error');
    }
  };

  if (!user) return <LoginRequired />;
  if (loading) return <LoadingSpinner message="Loading your profile..." />;

  const currentUser = userProfile || user;

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

      {/* Custom Delete Confirmation Modals */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setPostToDelete(null);
        }}
        onConfirm={confirmDelete}
        postTitle={postToDelete?.title || ''}
        isLoading={deleteLoading}
      />

      <BulkDeleteConfirmationModal
        isOpen={showBulkDeleteModal}
        onClose={() => setShowBulkDeleteModal(false)}
        onConfirm={confirmBulkDelete}
        postCount={selectedPosts.length}
        isLoading={deleteLoading}
      />

      <EditProfileModal
        user={currentUser}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveProfile}
      />

      <ProfileHeader
        user={currentUser}
        posts={posts}
        profileStats={profileStats}
        onEditProfile={handleEditProfile}
      />

      <ProfileActions
        onExportPosts={handleExportPosts}
        onBulkDelete={handleBulkDelete}
        selectedPosts={selectedPosts}
      />

      <PostsControls
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortBy={sortBy}
        setSortBy={setSortBy}
        filterBy={filterBy}
        setFilterBy={setFilterBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
        showToast={showToast}
      />

      {error && <div className="error">{error}</div>}

      <ProfilePostsList
        posts={posts}
        onDelete={handleDelete}
        onDuplicate={handleDuplicate}  
        searchTerm={searchTerm}
        sortBy={sortBy}
        filterBy={filterBy}
        viewMode={viewMode}
      />
    </>
  );
};

export default Profile;