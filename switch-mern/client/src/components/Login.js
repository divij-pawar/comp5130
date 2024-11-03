import React, { useState } from 'react';
import './Form.css';

const LoginComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your login logic here
  };

  return (
    <div className="content-section">
      {/* Navigation Bar */}
      <nav className="navbar">
        <button onClick={() => window.location.href = '/home'}>Home</button>
        <button onClick={() => window.location.href = '/register'}>Register</button>
        <button onClick={() => window.location.href = '/login'}>Login</button>
        <button onClick={() => window.location.href = '/hotitems'}>Hot Items</button>
      </nav>

      <form onSubmit={handleSubmit}>
        <fieldset className="form-group">
          <legend className="border-bottom mb-4">Log In</legend>

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
          <button type="submit" className="btn btn-dark">Log In</button>
        </div>
      </form>
      <small className="text-muted">
        Need An Account? <a className="ml-2" href="/register">Sign Up Now</a>
      </small>
    </div>
  );
};

export default LoginComponent;
