// client/src/components/Posts/PostDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { postsAPI } from '../../services/api';
import LoadingSpinner from '../UI/LoadingSpinner';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await postsAPI.getPost(id);
        setPost(response.data);
      } catch (error) {
        setError('Failed to fetch post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <LoadingSpinner message="Loading post..." />;
  if (error) return <div className="error">{error}</div>;
  if (!post) return <div className="error">Post not found</div>;

  const isOwner = user && user.id === post.author._id;

  // Get the image URL - check both uploaded image and URL-based image
  const getImageUrl = () => {
    if (post.image && post.image.url) {
      return post.image.url; // Uploaded image from Cloudinary
    }
    return post.imageURL; // URL-based image
  };

  const imageUrl = getImageUrl();

  return (
    <div>
      {/* Back Button */}
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => navigate('/')}
          className="btn btn-secondary"
        >
          ← Back to Posts
        </button>
      </div>

      {/* Post Content */}
      <article className="card" style={{ padding: '40px' }}>
        {imageUrl && (
          <img 
            src={imageUrl} 
            alt={post.title}
            style={{ 
              width: '100%', 
              maxHeight: '400px', 
              objectFit: 'cover', 
              borderRadius: '12px',
              marginBottom: '30px'
            }}
            onError={(e) => {
              console.log('Image failed to load:', imageUrl);
              e.target.style.display = 'none';
            }}
          />
        )}
        
        <header style={{ marginBottom: '30px' }}>
          <h1 style={{ 
            fontSize: '36px', 
            marginBottom: '16px',
            lineHeight: '1.2'
          }}>
            {post.title}
          </h1>
          
          <div className="post-meta" style={{ fontSize: '16px' }}>
            <span>👤 By {post.authorName}</span>
            <span>•</span>
            <span>📅 {new Date(post.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
            <span>•</span>
            <span>📖 {Math.ceil(post.content.length / 200)} min read</span>
          </div>
          
          {isOwner && (
            <div style={{ marginTop: '20px' }}>
              <Link 
                to={`/edit/${post._id}`} 
                className="btn btn-primary"
                style={{ marginRight: '10px' }}
              >
                ✏️ Edit Post
              </Link>
            </div>
          )}
        </header>
        
        <div style={{ 
          fontSize: '18px',
          lineHeight: '1.8',
          whiteSpace: 'pre-wrap',
          color: '#444'
        }}>
          {post.content}
        </div>
        
        {post.updatedAt !== post.createdAt && (
          <div style={{ 
            marginTop: '30px', 
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#666'
          }}>
            Last updated: {new Date(post.updatedAt).toLocaleDateString()}
          </div>
        )}


      </article>

      {/* Related Actions */}
      <div className="card" style={{ padding: '30px', marginTop: '30px', textAlign: 'center' }}>
        <h3 style={{ marginBottom: '20px' }}>What's next?</h3>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary">
            📚 Browse More Posts
          </Link>
          {user && (
            <Link to="/create" className="btn btn-success">
              ✍️ Write Your Own
            </Link>
          )}
          {!user && (
            <Link to="/register" className="btn btn-success">
              🚀 Join the Community
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;