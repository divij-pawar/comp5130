// RegisterComponent.jsx
import React, { useState } from 'react';
import './Form.css';

const RegisterComponent = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({ username: '', email: '', password: '', confirmPassword: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform validation and submit logic here
    // Set errors if any
  };

  return (
    <div className="content-section">
      <form onSubmit={handleSubmit}>
        <fieldset className="form-group">
          <legend className="border-bottom mb-4">Register</legend>

          <div className="form-group">
            <label htmlFor="username" className="form-control-label">Username</label>
            <input
              type="text"
              className={`form-control form-control-lg ${errors.username ? 'is-invalid' : ''}`}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              id="username"
            />
            {errors.username && (
              <div className="invalid-feedback">
                <span>{errors.username}</span>
              </div>
            )}
          </div>

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

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-control-label">Confirm Password</label>
            <input
              type="password"
              className={`form-control form-control-lg ${errors.confirmPassword ? 'is-invalid' : ''}`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              id="confirmPassword"
            />
            {errors.confirmPassword && (
              <div className="invalid-feedback">
                <span>{errors.confirmPassword}</span>
              </div>
            )}
          </div>
        </fieldset>

        <div className="form-group">
          <button type="submit" className="btn btn-dark">Register</button>
        </div>
      </form>
      <small className="text-muted">
        Already a User? <a className="ml-2" href="/login">Sign in here</a>
      </small>
    </div>
  );
};

export default RegisterComponent;
