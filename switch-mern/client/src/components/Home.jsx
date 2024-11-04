import React from 'react';
import './style/home.css';
import Navbar from './Navbar';

const Home = ({ posts, pagination, onPageChange }) => {
  const { currentPage, totalPages } = pagination;

  // Handles previous and next page navigation
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="home-container">
      <Navbar /> {/* Add Navbar here */}

      <h1>Latest Posts</h1>

      {/* Render posts */}
      <div className="posts-list">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id} className="post-card">
              <img src={post.image_file} alt={post.title} className="post-image" />
              <div className="post-details">
                <h2>{post.title}</h2>
                <p>{post.content}</p>
                <p>Price: ${post.price}</p>
                <p>Date Posted: {new Date(post.date_posted).toLocaleDateString()}</p>
                <div className="post-author">
                  <img src={post.author.image_file} alt={post.author.username} className="author-image" />
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

      {/* Pagination Controls */}
      <div className="pagination-controls">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Home;
