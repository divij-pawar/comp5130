import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
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
        <div className="navbar-links">
          <Link to="/hot-items" className="navbar-link">Hot Items</Link>
          <Link to="/about" className="navbar-link">About</Link>
          <Link to="/account" className="navbar-link">Account</Link>
          <Link to="/contact" className="navbar-link">Contact</Link>
        </div>
        <Link to="/signup" className="signup-button">Sign up</Link>
      </div>
    </nav>
  );
}

export default Navbar;
