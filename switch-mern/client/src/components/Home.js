// components/Home.js

import React from 'react';
import './home.css'; // Optional: For specific styling of Home component

const Home = ({ posts, pagination }) => {
  return (
    <div className="home-container">
      <h1>Latest Posts</h1>
      <div className="posts-list">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <img src={post.image_file} alt={post.title} className="post-image" />
            <div className="post-details">
              <h2>{post.title}</h2>
              <p>{post.content}</p>
              <p>Price: ${post.price}</p>
              <p>Date Posted: {new Date(post.date_posted).toLocaleDateString()}</p>
              <div className="post-author">
                <img src={post.author.image_file} alt={post.author.username} className="author-image" />
                <span className="post-username">{post.author.username}</span> • <span className="post-location">{post.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Pagination */}
      <div className="pagination">
        {pagination.iter_pages.map((pageNum) => (
          <button key={pageNum} className={pagination.page === pageNum ? 'active' : ''}>
            {pageNum}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Home;
