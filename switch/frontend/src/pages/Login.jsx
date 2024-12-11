import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginComponent = () => {
  const [username, setUsername] = useState(''); // Change from email to username
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // Initialize navigate function

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Reset any previous error

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const { token } = data;

        // Save token to localStorage or sessionStorage based on 'remember'
        if (remember) {
          localStorage.setItem('token', token); // Store token in localStorage if "remember me" is checked
        } else {
          sessionStorage.setItem('token', token); // Store token in sessionStorage if not checked
        }

        // Navigate to the home page or dashboard
        navigate('/home');
      } else {
        setError(data.message || 'Invalid username or password.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h2 className="signup-title">Log In</h2>

        {error && <div className="error-message">{error}</div>} {/* Error message in red */}

        <form onSubmit={handleSubmit}>
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
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group remember">
            <input
              type="checkbox"
              className="form-check-input"
              checked={remember}
              onChange={() => setRemember(!remember)}
              id="remember"
            />
            <label htmlFor="remember" className="form-check-label">Remember Me</label>
          </div>

          <small className="text-muted">
            <a href="/reset-password">Forgot Password?</a>
          </small>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <small className="text-muted">
          Need an account? <a href="/signup">Sign Up Now</a>
        </small>
      </div>
    </div>
  );
};

export default LoginComponent;
