import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import About from './components/About';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import './components/main.css'; // Assuming global CSS for the app

function App() {
  // Mock posts data
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: 'Book Sale',
      content: 'Selling old textbooks in great condition.',
      price: 500,
      date_posted: '2024-10-01T12:00:00',
      author: {
        username: 'john_doe',
        email: 'john@example.com',
        image_file: 'john_profile.jpg',
      },
      image_file: 'books_for_sale.jpg',
    },
    {
      id: 2,
      title: 'Guitar for Sale',
      content: 'Barely used acoustic guitar available for sale.',
      price: 3000,
      date_posted: '2024-10-02T15:00:00',
      author: {
        username: 'jane_doe',
        email: 'jane@example.com',
        image_file: 'jane_profile.jpg',
      },
      image_file: 'guitar_sale.jpg',
    },
    {
      id: 3,
      title: 'Guitar for Sale3',
      content: 'Barely used acoustic guitar available for sale.',
      price: 3000,
      date_posted: '2024-10-02T15:00:00',
      author: {
        username: 'jane_doe',
        email: 'jane@example.com',
        image_file: 'jane_profile.jpg',
      },
      image_file: 'guitar_sale.jpg',
    },
    {
      id: 4,
      title: 'Guitar for Sale4',
      content: 'Barely used acoustic guitar available for sale.',
      price: 3000,
      date_posted: '2024-10-02T15:00:00',
      author: {
        username: 'jane_doe',
        email: 'jane@example.com',
        image_file: 'jane_profile.jpg',
      },
      image_file: 'guitar_sale.jpg',
    },
  ]);

  // Example pagination data
  const pagination = {
    page: 1,
    iter_pages: [1, 2, 3],
  };

  return (
    <Router>
      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Home route with posts and pagination passed separately */}
        <Route path="/home" element={<Home posts={posts} pagination={pagination} />} />
        {/* Default route redirects to Register */}
        <Route path="/" element={<Home posts={posts} pagination={pagination} />} />
      </Routes>
    </Router>
  );
}

export default App;
