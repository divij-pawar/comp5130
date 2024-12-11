import React, { useState, useMemo } from 'react';

const Home = ({ posts }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 4; // Adjust the number of posts per page

  // Calculate the index of the first and last posts on the current page
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;

  // Use memoization to calculate current posts only when necessary
  const currentPosts = useMemo(() => {
    return posts.slice(indexOfFirstPost, indexOfLastPost);
  }, [currentPage, posts]);

  // Handle page changes
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Fallback image URL
  const getImageSrc = (imageFile) => {
     return imageFile && imageFile.trim() !== ''
      ? `http://localhost:5000/uploads/${imageFile}`
      : `http://localhost:5000/uploads/default.jpg`;  // Default fallback image
  };

  return (
    <div className="container">
      <h1 className="page-title">Welcome to Switch</h1>
      <p className="page-content">This is the home page of our application.</p>

      <h2>Latest Posts</h2>

      {/* Render posts */}
      <div className="posts-list">
        {Array.isArray(posts) && posts.length > 0 ? (
          currentPosts.map((post) => (
            <div key={post._id} className="post-card">
              <div className="post-details">
                <h3>{post.title}</h3>
                <p>Posted: {new Date(post.date_posted).toLocaleDateString()}</p>
                <p>Price: ${post.price}</p>

                {/* Image with fallback for missing images */}
                <img 
                  src={getImageSrc(post.image_file)} 
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
        {Array.from({ length: Math.ceil(posts.length / postsPerPage) }, (_, index) => (
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
