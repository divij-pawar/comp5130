import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div>
          <Link to="/" className="footer-logo">Switch</Link>
          <p className="footer-description">A micro-marketplace for your university.</p>
        </div>
        <div className="footer-links">
          <div className="footer-section">
            <h3>Account</h3>
            <ul>
              <li><Link to="/account">Account</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/signup">Sign Up</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/home">Home</Link></li>
              <li><Link to="/hot-items">Hot Items</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Support</h3>
            <ul>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Divij Pawar. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;

