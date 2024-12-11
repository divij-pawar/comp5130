import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [posts, setPosts] = useState([]); // State to hold posts
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 8; // Number of posts per page
  const [totalPages, setTotalPages] = useState(1); // Total pages for pagination
  const navigate = useNavigate(); // React Router's navigation hook

  // Function to fetch posts from the API
  const fetchPosts = async (page) => {
    try {
      const response = await axios.get('http://localhost:5000/api/posts', {
        params: {
          page: page,
          limit: postsPerPage,
        },
      });
      setPosts(response.data.posts); // Update posts state
      setTotalPages(response.data.pagination.totalPages); // Update total pages
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  // Fetch posts when the component mounts or when currentPage changes
  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  // Handle page changes
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle navigation to individual post
  const viewPost = (postId) => {
    navigate(`/posts/${postId}`); // Redirect to post's route
  };

  return (
    <div className="container">
      <h1 className="page-title">Welcome to Switch</h1>
      <p className="page-content">This is the home page of our application.</p>

      <h2>Latest Posts</h2>

      {/* Render posts */}
      <div className="posts-list">
        {Array.isArray(posts) && posts.length > 0 ? (
          posts.map((post) => (
            <div 
              key={post._id} 
              className="post-card" 
              onClick={() => viewPost(post._id)} // Navigate on click
              style={{ cursor: 'pointer' }} // Add a pointer cursor to indicate clickability
            >
              <div className="post-details">
                <h3>{post.title}</h3>
                <p>Posted: {new Date(post.date_posted).toLocaleDateString()}</p>
                <p>Price: ${post.price}</p>
                <img 
                  src={`http://localhost:5000/uploads/${post.image_file || 'default.jpg'}`} 
                  alt={post.title} 
                  className="post-image"
                />
                <p>{post.content}</p>
                <div className="post-author">
                  <span className="post-username">{post.author.username}</span> •
                  <span className="post-location">{post.location}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No posts available.</p>
        )}
      </div>

      {/* Pagination controls */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            disabled={currentPage === index + 1}
            className={`page-button ${currentPage === index + 1 ? 'active' : ''}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Home;
