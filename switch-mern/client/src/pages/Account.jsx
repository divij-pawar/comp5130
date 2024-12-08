// Account.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import '../styles/Form.css';

const Account = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [currentProfilePic, setCurrentProfilePic] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/users/me', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        setName(data.name);
        setEmail(data.email);
        setCurrentProfilePic(data.profilePic);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setErrorMessage('Failed to load user information.');
      }
    };

    fetchUserData();
  }, []);

  const handleProfilePicChange = (e) => {
    setProfilePic(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    if (profilePic) formData.append('profilePic', profilePic);

    try {
      const response = await fetch('http://localhost:3000/api/users/me', {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        setSuccessMessage('Account updated successfully.');
        setErrorMessage('');
        const updatedData = await response.json();
        setCurrentProfilePic(updatedData.profilePic);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Failed to update account.');
        setSuccessMessage('');
      }
    } catch (error) {
      console.error('Error updating account:', error);
      setErrorMessage('An error occurred while updating account.');
      setSuccessMessage('');
    }
  };

  return (
    <div>
      <div className="content-section">
      <Navbar /> {/* Add Navbar here */}
        <h2>Account Settings</h2>
        {successMessage && <div className="alert alert-success">{successMessage}</div>}
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

        <form onSubmit={handleSubmit}>
          <fieldset className="form-group">
            <legend className="border-bottom mb-4">Edit Account Information</legend>

            <div className="form-group">
              <label htmlFor="name" className="form-control-label">Name</label>
              <input
                type="text"
                className="form-control form-control-lg"
                value={name}
                onChange={(e) => setName(e.target.value)}
                id="name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-control-label">Email</label>
              <input
                type="email"
                className="form-control form-control-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="profilePic" className="form-control-label">Profile Picture</label>
              <input
                type="file"
                className="form-control-file"
                id="profilePic"
                accept="image/*"
                onChange={handleProfilePicChange}
              />
              {currentProfilePic && (
                <div className="current-profile-pic">
                  <p>Current Profile Picture:</p>
                  <img src={currentProfilePic} alt="Profile" className="profile-image-preview" />
                </div>
              )}
            </div>

            <div className="form-group">
              <button type="submit" className="btn btn-dark">Save Changes</button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default Account;
