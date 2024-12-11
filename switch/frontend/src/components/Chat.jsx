import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Connect to the server

const ChatComponent = () => {
  const [username, setUsername] = useState(localStorage.getItem('username') || ''); // Use the username from localStorage
  const [recipient, setRecipient] = useState(''); // Recipient username entered manually
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // Initialize navigate function

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    if (!token) {
      // If no token, navigate to login page
      navigate('/login');
      return;
    }

    // If username is not set, fetch it from the server
    if (!username) {
      fetch('http://localhost:5000/api/users/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Send the token for authentication
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('User not authenticated');
          }
          return response.json();
        })
        .then((data) => {
          if (data.username) {
            setUsername(data.username); // Set the username from the API response
            // Optionally, save the username in localStorage to persist across reloads
            localStorage.setItem('username', data.username);
          }
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
          // If the user is not authenticated, clear the token and redirect to login
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
          navigate('/login');
        });
    }

    // Fetch previous messages when the component mounts
    const fetchMessages = () => {
      fetch('http://localhost:5000/api/messages', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Send the token for authentication
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setMessages(data); // Populate the messages state with fetched data
        })
        .catch((error) => {
          console.error('Error fetching messages:', error);
        });
    };

    fetchMessages();

    // Listen for incoming messages from the server
    socket.on('chatMessage', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]); // Add new message to state
    });

    // Clean up the socket connection on unmount
    return () => {
      socket.off('chatMessage');
    };
  }, [username, navigate]);

  const handleSendMessage = () => {
    if (message.trim()) {
      setLoading(true);
      // Emit the message to the specific recipient
      socket.emit('chatMessage', { from: username, to: recipient, message });
      setMessage(''); // Clear the input field
      setLoading(false);
    } else {
      setError('Message cannot be empty.');
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-form">
        <h2 className="chat-title">Chat</h2>

        {error && <div className="error-message">{error}</div>} {/* Error message in red */}

        {/* Select Recipient Section */}
        {username && (
          <>
            <div className="form-group">
              <label htmlFor="recipient" className="form-label">Recipient Username</label>
              <input
                type="text"
                id="recipient"
                className="form-input"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Enter recipient's username"
              />
            </div>

            {/* Chat Box */}
            <div className="chat-box">
              <div style={{ border: '1px solid #ddd', padding: '10px', height: '300px', overflowY: 'scroll' }}>
                {messages
                  .filter((msg) => msg.to === username || msg.from === username)
                  .map((msg, index) => (
                    <p key={index}>
                      <strong>{msg.from}:</strong> {msg.message}
                    </p>
                  ))}
              </div>
            </div>

            {/* Message Input Section */}
            <div className="form-group">
              <label htmlFor="message" className="form-label">Message</label>
              <input
                type="text"
                id="message"
                className="form-input"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message"
              />
            </div>

            <button
              type="button"
              className="submit-button"
              onClick={handleSendMessage}
              disabled={loading || !recipient}
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </>
        )}

        <small className="text-muted">
          <a href="/home">Back to Home</a>
        </small>
      </div>
    </div>
  );
};

export default ChatComponent;
