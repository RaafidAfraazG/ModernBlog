// Enhanced EditPost.js with matching UI from CreatePost
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { postsAPI } from '../../services/api';
import { useToast } from '../../hooks/useToast';
import Toast from '../UI/Toast';

const EditPost = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageURL: ''
  });
  const [imageOption, setImageOption] = useState('url');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [originalPost, setOriginalPost] = useState(null);
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const { toasts, showToast, removeToast } = useToast();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await postsAPI.getPost(id);
        const post = response.data;
        
        // Check if user is the owner
        if (post.author._id !== user?.id) {
          showToast('You can only edit your own posts', 'error');
          navigate('/');
          return;
        }

        setOriginalPost(post);
        setFormData({
          title: post.title,
          content: post.content,
          imageURL: post.imageURL || ''
        });

        // Set image option based on existing image
        if (post.imageURL) {
          setImageOption('url');
        }
      } catch (error) {
        console.error('Fetch post error:', error);
        showToast('Failed to fetch post', 'error');
        navigate('/');
      } finally {
        setFetchLoading(false);
      }
    };

    if (user) {
      fetchPost();
    }
  }, [id, user, navigate, showToast]);

  if (!user) {
    return (
      <div className="card" style={{ padding: '60px', textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔒</div>
        <h3>Login Required</h3>
        <p>Please log in to edit posts.</p>
      </div>
    );
  }

  if (fetchLoading) {
    return (
      <div className="card" style={{ padding: '60px', textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>⏳</div>
        <h3>Loading Post...</h3>
        <p>Please wait while we fetch your post.</p>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('File selected:', file.name, file.size, file.type); // Debug log
      
      if (file.size > 5 * 1024 * 1024) {
        showToast('File size must be less than 5MB', 'error');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        showToast('Please select an image file', 'error');
        return;
      }
      
      setImageFile(file);
      setFormData({ ...formData, imageURL: '' });
    }
  };

  const handleImageOptionChange = (option) => {
    setImageOption(option);
    if (option === 'url') {
      setImageFile(null);
    } else {
      setFormData({ ...formData, imageURL: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.title.length < 5 || formData.content.length < 50) return;

    console.log('=== EDIT SUBMIT DEBUG ===');
    console.log('Image Option:', imageOption);
    console.log('Has Image File:', !!imageFile);
    console.log('Image File Details:', imageFile ? {
      name: imageFile.name,
      size: imageFile.size,
      type: imageFile.type
    } : 'None');
    console.log('Form Data:', formData);

    setLoading(true);

    try {
      const postData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        imageURL: imageOption === 'url' ? (formData.imageURL?.trim() || undefined) : undefined
      };

      const imageFileToUpload = imageOption === 'upload' ? imageFile : null;
      
      console.log('Prepared Post Data:', postData);
      console.log('Image File to Upload:', imageFileToUpload ? 'File object' : 'None');
      
      console.log('Calling postsAPI.updatePost...');
      const response = await postsAPI.updatePost(id, postData, token, imageFileToUpload);
      
      console.log('API Response:', response);
      showToast('Post updated successfully! 🎉');
      setTimeout(() => navigate(`/post/${id}`), 1000);
    } catch (error) {
      console.error('=== EDIT SUBMIT ERROR ===');
      console.error('Error object:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      if (error.response?.data?.errors) {
        showToast(error.response.data.errors.map(err => err.msg).join(', '), 'error');
      } else {
        showToast(error.response?.data?.message || error.message || 'Failed to update post', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const isValid = formData.title.length >= 5 && formData.title.length <= 120 && formData.content.length >= 50;

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
      
      <div className="card" style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ marginBottom: '30px', textAlign: 'center' }}>✏️ Edit Post</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Title (5-120 characters)</label>
            <input
              type="text"
              name="title"
              value={formData.title || ''}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter an engaging title..."
            />
            <small style={{ 
              color: formData.title.length < 5 || formData.title.length > 120 ? '#ff416c' : '#666' 
            }}>
              {formData.title.length}/120 characters
            </small>
          </div>
          
          <div className="form-group">
            <label className="form-label">Content (minimum 50 characters)</label>
            <textarea
              name="content"
              value={formData.content || ''}
              onChange={handleChange}
              className="form-textarea"
              rows={12}
              placeholder="Write your amazing content here..."
            />
            <small style={{ color: formData.content.length < 50 ? '#ff416c' : '#666' }}>
              {formData.content.length} characters {formData.content.length < 50 ? '(minimum 50)' : '✓'}
            </small>
          </div>
          
          <div className="form-group">
            <label className="form-label">Image (optional)</label>
            
            {/* Image option selector */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="imageOption"
                  value="url"
                  checked={imageOption === 'url'}
                  onChange={() => handleImageOptionChange('url')}
                />
                URL
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="imageOption"
                  value="upload"
                  checked={imageOption === 'upload'}
                  onChange={() => handleImageOptionChange('upload')}
                />
                Upload from system
              </label>
            </div>

            {/* Conditional input based on selected option */}
            {imageOption === 'url' ? (
              <input
                type="url"
                name="imageURL"
                value={formData.imageURL || ''}
                onChange={handleChange}
                className="form-input"
                placeholder="https://example.com/image.jpg"
              />
            ) : (
              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="form-input"
                style={{ padding: '8px' }}
              />
            )}

            {/* Display selected file info */}
            {imageFile && (
              <small style={{ color: '#666', display: 'block', marginTop: '8px' }}>
                Selected: {imageFile.name} ({(imageFile.size / 1024 / 1024).toFixed(2)} MB)
              </small>
            )}
            
            {/* Current image info */}
            {originalPost?.imageURL && imageOption === 'url' && !imageFile && (
              <small style={{ color: '#666', display: 'block', marginTop: '8px' }}>
                Current image: {originalPost.imageURL}
              </small>
            )}
            
            {/* File size limit info */}
            {imageOption === 'upload' && (
              <small style={{ color: '#666', display: 'block', marginTop: '4px' }}>
                Maximum file size: 5MB. Supported formats: JPG, PNG, GIF, WebP
              </small>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button 
              type="submit" 
              disabled={loading || !isValid}
              className="btn btn-success"
              style={{ opacity: (!isValid || loading) ? 0.6 : 1 }}
            >
              {loading ? '✨ Updating...' : '💾 Update Post'}
            </button>
            
            <button 
              type="button" 
              onClick={() => navigate(`/post/${id}`)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditPost;