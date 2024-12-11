import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PostDetails = () => {
  const { id } = useParams(); // Extract ID from URL
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');

      if (!token) {
        navigate('/');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/posts/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPost(response.data);
      } catch (err) {
        setError('Failed to fetch post details');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, navigate]);

  if (loading) return <div>Loading post details...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="post-details-container">
      <h1>{post.title}</h1>
      <p>Posted: {new Date(post.date_posted).toLocaleDateString()}</p>
      <p>Price: ${post.price}</p>
      <img
        src={`http://localhost:5000/uploads/${post.image_file || 'default.jpg'}`}
        alt={post.title}
      />
      <p>{post.content}</p>
      <div>
        <strong>Author:</strong> {post.author.username}
      </div>
      <div>
        <strong>Location:</strong> {post.location}
      </div>
    </div>
  );
};

export default PostDetails;
