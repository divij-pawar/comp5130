import React, { useState } from 'react';
import '../styles/Form.css';
import Navbar from '../components/Navbar';

const RegisterComponent = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = () => {
    let formErrors = { username: '', email: '', password: '', confirmPassword: '' };
    let isValid = true;

    if (!username) {
      formErrors.username = 'Username is required.';
      isValid = false;
    }
    if (!email) {
      formErrors.email = 'Email is required.';
      isValid = false;
    }
    if (!password) {
      formErrors.password = 'Password is required.';
      isValid = false;
    }
    if (password !== confirmPassword) {
      formErrors.confirmPassword = 'Passwords do not match.';
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form before submitting
    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('email', email);
    if (imageFile) {
      formData.append('image_file', imageFile); // Append image file if it exists
    }

    try {
      const response = await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        body: formData, // Send FormData instead of JSON
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrors({ ...errors, ...errorData });
        return;
      }

      const userData = await response.json();
      setSuccessMessage('User registered successfully!'); // Set success message
      // Reset form
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setImageFile(null);
      setErrors({ username: '', email: '', password: '', confirmPassword: '' });

    } catch (error) {
      console.error('Error:', error);
      setErrors({ username: 'Error occurred during registration. Please try again.' });
    }
  };

  return (
    <div className="content-section">
      <Navbar /> {/* Add Navbar here */}

      <form onSubmit={handleSubmit}>
        <fieldset className="form-group">
          <legend className="border-bottom mb-4">Register</legend>

          {successMessage && <div className="alert alert-success">{successMessage}</div>}

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
          <div className="form-group">
            <label htmlFor="imageFile" className="form-control-label">Profile Image</label>
            <input
              type="file"
              className="form-control-file"
              id="imageFile"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])} // Set image file
            />
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
