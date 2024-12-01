// Login.jsx
import React, { useState } from 'react';
import './style/Form.css';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const LoginComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });

  // Add state to handle loading and success/error messages
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // Initialize navigate

  // Handle login submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        const { token } = data;

        // Store JWT token
        if (remember) {
          localStorage.setItem('token', token);  // Use local storage if "remember me" is checked
        } else {
          sessionStorage.setItem('token', token); // Otherwise, use session storage
        }

        // Redirect to the homepage
        navigate('/home');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err); 
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-section">
      <Navbar />

      <form onSubmit={handleSubmit}>
        <fieldset className="form-group">
          <legend className="border-bottom mb-4">Log In</legend>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="form-group">
            <label htmlFor="email" className="form-control-label">Email</label>
            <input
              type="email"
              className={`form-control form-control-lg ${errors.email ? 'is-invalid' : ''}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
            />
            {errors.email && (
              <div className="invalid-feedback">
                <span>{errors.email}</span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-control-label">Password</label>
            <input
              type="password"
              className={`form-control form-control-lg ${errors.password ? 'is-invalid' : ''}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="password"
            />
            {errors.password && (
              <div className="invalid-feedback">
                <span>{errors.password}</span>
              </div>
            )}
          </div>

          <div className="col-5 remember">
            <input
              type="checkbox"
              className="form-check-input"
              checked={remember}
              onChange={() => setRemember(!remember)}
              id="remember"
            />
            <label htmlFor="remember" className="form-check-label">Remember Me</label>
          </div>

          <small className="text-muted ml-2">
            <a href="/reset-password">Forgot Password?</a>
          </small>
        </fieldset>

        <div className="form-group">
          <button type="submit" className="btn btn-dark" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </div>
      </form>
      <small className="text-muted">
        Need An Account? <a className="ml-2" href="/register">Sign Up Now</a>
      </small>
    </div>
  );
};

export default LoginComponent;
