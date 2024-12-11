import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState(null);  // Store the image file
  const [location, setLocation] = useState('');
  const [imagePreview, setImagePreview] = useState(null); // State to store the image preview
  const [error, setError] = useState(null);  // Error state
  const [loading, setLoading] = useState(false);  // Loading state
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Set image preview URL
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    if (!token) {
      alert('You need to be logged in to create a post');
      return;
    }

    // Manually format date as MM-DD-YY
    const currentDate = new Date();
    const formattedDate = `${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}-${currentDate.getFullYear().toString().slice(-2)}`;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('price', price);
    formData.append('location', location);
    formData.append('image_file', imageFile); // Append the image file to form data
    formData.append('date_posted', formattedDate); // Use custom formatted date

    setLoading(true);  // Set loading to true before the API call
    setError(null);    // Reset error state

    try {
      const response = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData, // Send form data (image + other data) to backend
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Post submitted successfully:', result);
        navigate('/'); // Redirect after success
      } else {
        const error = await response.json();
        setError(error.message || 'Failed to create post');
      }
    } catch (error) {
      console.error('Error submitting post:', error);
      setError('Server error. Please try again later.');
    } finally {
      setLoading(false);  // Reset loading after API call
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h2 className="signup-title">Create a New Post</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title" className="form-label">Title</label>
            <input
              type="text"
              id="title"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="content" className="form-label">Content</label>
            <textarea
              id="content"
              className="form-input"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="price" className="form-label">Price</label>
            <input
              type="number"
              id="price"
              className="form-input"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="imageFile" className="form-label">Image Upload</label>
            <input
              type="file"
              id="imageFile"
              className="form-input"
              onChange={handleImageChange}
              accept="image/*"
            />
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" className="preview-image" />
              </div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="location" className="form-label">Location</label>
            <input
              type="text"
              id="location"
              className="form-input"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Submitting...' : 'Create Post'}
          </button>
          {error && <p className="error-message">{error}</p>} {/* Display error message */}
        </form>
      </div>
    </div>
  );
}

export default CreatePost;
