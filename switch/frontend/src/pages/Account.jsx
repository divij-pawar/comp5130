import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Account.css';

function Account() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Fetch the user's current data when the component mounts
  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (!token) {
      navigate('/');
    } else {
      // Fetch user data from the /api/users/me endpoint
      fetch('http://localhost:5000/api/users/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          // Prefill the form with user data, and ensure firstName/lastName are empty if not provided
          setUsername(data.username);
          setEmail(data.email);
          setFirstName(data.firstName || ''); // Use empty string if no first name
          setLastName(data.lastName || '');   // Use empty string if no last name
        })
        .catch((error) => {
          console.error(error);
          setError('Failed to fetch user data.');
        });
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (!token) {
      setError('Authentication required.');
      setLoading(false);
      return;
    }

    const updatedData = {
      username,
      email,
      firstName,
      lastName,
    };

    fetch('http://localhost:5000/api/users', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          setError(data.message); // Display error message if any
        } else {
          console.log('Account updated successfully:', data);
          alert('Account updated successfully!');
          navigate('/account'); // Example redirect
        }
      })
      .catch((error) => {
        console.error(error);
        setError('An error occurred while updating your account.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="account-container">
      <div className="account-form">
        <h2 className="account-title">Account Settings</h2>
        
        {error && <div className="error-message">{error}</div>} {/* Error message in red */}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="firstName" className="form-label">First Name</label>
            <input
              type="text"
              id="firstName"
              className="form-input"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName" className="form-label">Last Name</label>
            <input
              type="text"
              id="lastName"
              className="form-input"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              id="username"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave empty to keep the same password"
            />
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Saving...' : 'Change Account Settings'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Account;
