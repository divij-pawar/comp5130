import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import About from './components/About';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import './components/main.css'; // Assuming global CSS for the app

function App() {
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({ totalPages: 1, currentPage: 1, limit: 5 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch posts based on the current page
  const fetchPosts = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/posts?page=${page}&limit=${pagination.limit}`);
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await response.json();
      setPosts(data.posts);
      setPagination({
        totalPages: data.pagination.totalPages,
        currentPage: data.pagination.currentPage,
        limit: data.pagination.limit,
      });
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePageChange = (newPage) => {
    fetchPosts(newPage);
  };

  // Render loading state or error if any
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Home route with posts and pagination passed */}
        <Route
          path="/home"
          element={<Home posts={posts} pagination={pagination} onPageChange={handlePageChange} />}
        />
        {/* Default route redirects to Home */}
        <Route
          path="/"
          element={<Home posts={posts} pagination={pagination} onPageChange={handlePageChange} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
