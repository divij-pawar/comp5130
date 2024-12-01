// Navbar.jsx
import React from 'react';
import './style/home.css'; // Use a CSS file for styling the navbar

const Navbar = () => {
  return (
    <nav className="navbar">
      <button onClick={() => window.location.href = '/home'}>Home</button>
      <button onClick={() => window.location.href = '/register'}>Register</button>
      <button onClick={() => window.location.href = '/login'}>Login</button>
      <button onClick={() => window.location.href = '/hotitems'}>Hot Items</button>
      <button onClick={() => window.location.href = '/account'}>Account</button>
    </nav>
  );
};

export default Navbar;
