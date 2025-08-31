// client/src/components/Posts/PostList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postsAPI } from '../../services/api';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);

  const fetchPosts = async (page = 1, searchTerm = '') => {
    try {
      setLoading(true);
      const response = await postsAPI.getAllPosts(searchTerm, page, 6);
      setPosts(response.data.posts);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
      setTotalPosts(response.data.total || response.data.posts.length);
    } catch (error) {
      setError('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPosts(1, search);
  };

  // Get the image URL - check both uploaded image and URL-based image
  const getImageUrl = (post) => {
    if (post.image && post.image.url) {
      return post.image.url; // Uploaded image from Cloudinary
    }
    return post.imageURL; // URL-based image
  };

  // Calculate meaningful stats
  const calculateStats = () => {
    const postsThisWeek = posts.filter(post => {
      const postDate = new Date(post.createdAt);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return postDate >= weekAgo;
    }).length;

    const uniqueAuthors = [...new Set(posts.map(post => post.authorName))].length;

    return {
      totalPosts: totalPosts || posts.length,
      postsThisWeek,
      uniqueAuthors
    };
  };

  const stats = calculateStats();

  if (loading) return <div className="loading">Loading posts...</div>;

  return (
    <div>
      {/* Hero Section */}
      <div className="hero">
        <h1>Welcome to ModernBlog</h1>
        <p>Discover amazing stories and share your thoughts with the world</p>
      </div>

      {/* Enhanced Stats */}
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-number">{stats.totalPosts}</div>
          <div className="stat-label">Total Posts</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.uniqueAuthors}</div>
          <div className="stat-label">Writers</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.postsThisWeek}</div>
          <div className="stat-label">Posts This Week</div>
        </div>
        {search && (
          <div className="stat-card" style={{ background: 'var(--pure-black)' }}>
            <div className="stat-number" style={{ color: 'var(--neon-yellow)' }}>{posts.length}</div>
            <div className="stat-label" style={{ color: 'var(--neon-yellow)' }}>Search Results</div>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="search-container">
        <form onSubmit={handleSearch} style={{ position: 'relative' }}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts by title, content, or author..."
            className="search-input"
            style={{ paddingRight: '120px' }}
          />
          <button 
            type="submit" 
            className="btn btn-primary"
            style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              padding: '8px 16px',
              fontSize: '0.9rem'
            }}
          >
            Search
          </button>
        </form>
        
        {search && (
          <div style={{ 
            textAlign: 'center', 
            marginTop: '16px',
            color: 'var(--medium-gray)',
            fontWeight: '600'
          }}>
            Found {posts.length} results for "{search}"
            <button 
              onClick={() => {
                setSearch('');
                fetchPosts(1, '');
              }}
              style={{
                marginLeft: '12px',
                background: 'none',
                border: 'none',
                color: 'var(--electric-green)',
                cursor: 'pointer',
                fontWeight: 'bold',
                textDecoration: 'underline'
              }}
            >
              Clear Search
            </button>
          </div>
        )}
      </div>

      {error && <div className="error">{error}</div>}

      {/* Posts */}
      {posts.length === 0 ? (
        <div className="empty-state">
          <h3>{search ? 'No posts found' : 'No posts available'}</h3>
          <p>
            {search 
              ? `Try adjusting your search term or browse all posts` 
              : 'Be the first to create a post!'
            }
          </p>
          {search && (
            <button 
              onClick={() => {
                setSearch('');
                fetchPosts(1, '');
              }}
              className="btn btn-primary"
              style={{ marginTop: '16px' }}
            >
              View All Posts
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Results info */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '24px',
            padding: '0 8px'
          }}>
            <h2 style={{ 
              fontSize: '2rem', 
              fontFamily: 'Space Grotesk, sans-serif',
              margin: 0 
            }}>
              {search ? `Search Results` : 'Latest Posts'}
            </h2>
            <div style={{ 
              color: 'var(--medium-gray)', 
              fontWeight: '600',
              fontSize: '0.9rem'
            }}>
              Showing {posts.length} of {totalPosts} posts
              {totalPages > 1 && ` • Page ${currentPage} of ${totalPages}`}
            </div>
          </div>

          <div className="posts-grid">
            {posts.map(post => {
              const imageUrl = getImageUrl(post);
              
              return (
                <div key={post._id} className="card post-card">
                  {imageUrl && (
                    <img 
                      src={imageUrl} 
                      alt={post.title}
                      className="post-image"
                      onError={(e) => {
                        console.log('Image failed to load:', imageUrl);
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  
                  <div className="post-content">
                    <h3 className="post-title">
                      <Link to={`/post/${post._id}`}>{post.title}</Link>
                    </h3>
                    
                    <div className="post-meta">
                      <span className="post-author">
                        {post.authorName}
                      </span>
                      <span className="post-date">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                      <span style={{ color: 'var(--medium-gray)', fontSize: '0.8rem' }}>
                        {post.content.split(' ').length} words
                      </span>
                    </div>
                    
                    <p className="post-excerpt">
                      {post.content.substring(0, 120)}...
                    </p>
                    
                    <Link to={`/post/${post._id}`} className="btn btn-primary">
                      Read More →
                    </Link>


                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: '12px',
            marginBottom: '16px'
          }}>
            {/* Previous Button */}
            <button
              onClick={() => fetchPosts(currentPage - 1, search)}
              disabled={currentPage === 1}
              className={`page-btn ${currentPage === 1 ? 'disabled' : ''}`}
              style={{
                opacity: currentPage === 1 ? 0.5 : 1,
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
              }}
            >
              ← Prev
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
              // Show first, last, current, and adjacent pages
              if (
                page === 1 || 
                page === totalPages || 
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => fetchPosts(page, search)}
                    className={`page-btn ${page === currentPage ? 'active' : ''}`}
                  >
                    {page}
                  </button>
                );
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return <span key={page} style={{ color: 'var(--medium-gray)' }}>...</span>;
              }
              return null;
            })}

            {/* Next Button */}
            <button
              onClick={() => fetchPosts(currentPage + 1, search)}
              disabled={currentPage === totalPages}
              className={`page-btn ${currentPage === totalPages ? 'disabled' : ''}`}
              style={{
                opacity: currentPage === totalPages ? 0.5 : 1,
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
              }}
            >
              Next →
            </button>
          </div>

          {/* Page info */}
          <div style={{ 
            textAlign: 'center', 
            color: 'var(--medium-gray)', 
            fontSize: '0.9rem',
            fontWeight: '600'
          }}>
            Page {currentPage} of {totalPages} • {totalPosts} total posts
          </div>
        </div>
      )}
    </div>
  );
};

export default PostList;