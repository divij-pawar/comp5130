import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Connect to the server

const ChatComponent = () => {
  const [username, setUsername] = useState(localStorage.getItem('username') || ''); // Use the username from localStorage
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userList, setUserList] = useState([]); // List of users for selecting recipient

  const navigate = useNavigate(); // Initialize navigate function

  useEffect(() => {
    if (!username) {
      // If no username in localStorage, navigate to login page
      navigate('/login');
      return;
    }

    // Fetch a list of users from the server to choose a recipient (this could be from an API endpoint)
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users');
        console.log(response)
        console.log('Nothing')
        const data = await response.json();
        setUserList(data.users); // Set user list received from API
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    fetchUsers();

    // Listen for incoming messages from the server
    socket.on('chatMessage', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
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
              <label htmlFor="recipient" className="form-label">Select Recipient</label>
              <select
                id="recipient"
                className="form-input"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              >
                <option value="">Select a user...</option>
                {userList.map((user) => (
                  <option key={user} value={user}>
                    {user}
                  </option>
                ))}
              </select>
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
