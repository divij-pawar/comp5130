import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const navigate = useNavigate();

  // Check if the user is authenticated and set the username
  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    if (token && !username) { // Only fetch if no username in state
      fetch('http://localhost:5000/api/users/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Send the token for authentication
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('User not authenticated');
          }
          return response.json();
        })
        .then((data) => {
          if (data.username) {
            setUsername(data.username); // Set the username from the API response
            // Optionally, save the username in localStorage to persist across reloads
            localStorage.setItem('username', data.username);
          }
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
          // If the user is not authenticated, redirect to login
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
          navigate('/login');
        });
    }
  }, [username, navigate]);

  // Handle logout
  const handleLogout = () => {
    // Clear user data from storage
    localStorage.removeItem('token'); // Remove token from localStorage
    localStorage.removeItem('username'); // Remove username from localStorage
    sessionStorage.removeItem('token'); // Remove token from sessionStorage

    // Update state and redirect
    setUsername(''); // Clear the username from state
    navigate('/login'); // Redirect to login page
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          <img 
            src="/switch-black.png" 
            alt="Switch Logo" 
            className="navbar-logo-image" 
          />
          <span className="navbar-logo-text">Switch</span>
        </Link>

        {username && (
          <div className="navbar-greeting">
            <span>Hello, {username}!</span> {/* Show username if logged in */}
          </div>
        )}

        <div className="navbar-links">
          <Link to="/hotitems" className="navbar-link">Hot Items</Link>
          <Link to="/about" className="navbar-link">About</Link>
          {username && <Link to="/account" className="navbar-link">Account</Link>} {/* Show Account if authenticated */}
          {username && <Link to="/createpost" className="navbar-link">Create Post</Link>} {/* Show Create Post if authenticated */}
          <Link to="/contact" className="navbar-link">Contact</Link>
        </div>

        {/* Conditionally render the button */}
        {username ? (
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        ) : (
          <Link to="/signup" className="signup-button">Sign up</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
