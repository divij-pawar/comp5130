import React from 'react';

const Home = ({ posts}) => {


  return (
    <div className="container">
      
      <h1 className="page-title">Welcome to Switch</h1> 
      <p className="page-content">This is the home page of our application.</p> 
      
      <h2>Latest Posts</h2>

      {/* Render posts */}
      <div className="posts-list">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id} className="post-card">
              <img src={post.image_file} alt={post.title} className="post-image" />
              <div className="post-details">
                <h3>{post.title}</h3>
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
    </div>
  );
};

export default Home;
