import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div>
          <Link to="/" className="footer-logo">MyApp</Link>
          <p className="footer-description">Making the world a better place through constructing elegant hierarchies.</p>
        </div>
        <div className="footer-links">
          <div className="footer-section">
            <h3>Solutions</h3>
            <ul>
              <li><Link to="#">Marketing</Link></li>
              <li><Link to="#">Analytics</Link></li>
              <li><Link to="#">Commerce</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Support</h3>
            <ul>
              <li><Link to="#">Pricing</Link></li>
              <li><Link to="#">Documentation</Link></li>
              <li><Link to="#">Guides</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2023 MyApp, Inc. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;

