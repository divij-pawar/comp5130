const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const http = require('http');  // Import http for Socket.io integration
const socketIo = require('socket.io'); // Import socket.io
require('dotenv').config();

const app = express();
const server = http.createServer(app); // Create an HTTP server for Socket.io
const io = socketIo(server); // Initialize Socket.io on the server

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // Allow requests from this origin
    credentials: true
}));
app.use(express.json());

// Ensure the 'uploads' folder exists, create it if it doesn't
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Socket.io: Listen for a new connection
io.on('connection', (socket) => {
    console.log('A user connected');

    // Listen for chat messages from the client
    socket.on('chatMessage', (message) => {
        console.log('Received message:', message);

        // Broadcast the message to all connected clients
        io.emit('chatMessage', message);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});
// Set up multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Destination folder for storing images
    },
    filename: (req, file, cb) => {
        const fileName = Date.now() + path.extname(file.originalname); // Unique file name
        cb(null, fileName);
    }
});

const upload = multer({ storage: storage });

// Database connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Mongoose schema for Post
const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    price: { type: Number, required: true },
    date_posted: { type: Date, required: true },
    location: { type: String, required: true },
    author: {
        username: { type: String, required: true }
    },
    image_file: { type: String, required: true },
});

// Mongoose schema for User
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, default: '' },  // Default empty string if not provided
    lastName: { type: String, default: '' },   // Default empty string if not provided
});

// Mongoose models
const Post = mongoose.model('Post', postSchema);
const User = mongoose.model('User', userSchema);

// Middleware to authenticate JWT
function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract the token from the authorization header

    if (!token) return res.sendStatus(401); // Unauthorized if no token is provided

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Forbidden if token is invalid

        req.user = user; // Attach user info from token payload to the request object
        next(); // Continue to the next middleware or route handler
    });
}

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to Switch!');
});

// POST endpoint to create a new post
app.post('/api/posts', authenticateToken, upload.single('image_file'), async (req, res) => {
    const { title, content, price, date_posted, location } = req.body;
    const imageFile = req.file ? req.file.filename : null; // Get the filename of the uploaded image
    const author = { username: req.user.username }; // Use authenticated user's username as author

    // Validate required fields
    if (!title || !content || !price || !date_posted || !location || !imageFile) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const newPost = new Post({
            title,
            content,
            price,
            date_posted: new Date(date_posted),
            location,
            author,
            image_file: imageFile, // Store the image filename in the post document
        });

        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
});

// GET endpoint to fetch all existing posts
app.get('/api/posts', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;
        const totalPosts = await Post.countDocuments();
        const posts = await Post.find().skip(skip).limit(limit);
        const totalPages = Math.ceil(totalPosts / limit);

        res.json({
            posts,
            pagination: {
                totalPosts,
                totalPages,
                currentPage: page,
                limit,
            },
        });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching posts' });
    }
});

// PUT endpoint to update an existing post
app.put('/api/posts/:id', authenticateToken, upload.single('image_file'), async (req, res) => {
    const { id } = req.params;
    const { title, content, price, date_posted, location } = req.body;
    const imageFile = req.file ? req.file.filename : null; // Get the filename of the uploaded image

    try {
        const post = await Post.findOne({ id: parseInt(id) });

        // Check if post exists
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        // Check if the authenticated user is the author of the post
        if (post.author.username !== req.user.username) {
            return res.status(403).json({ message: 'You are not authorized to edit this post.' });
        }

        // Update post
        const updatedPost = await Post.findOneAndUpdate(
            { id: parseInt(id) },
            { title, content, price, date_posted: new Date(date_posted), location, image_file: imageFile || post.image_file },
            { new: true, runValidators: true }
        );

        res.json(updatedPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
});

// DELETE endpoint to remove a post
app.delete('/api/posts/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const post = await Post.findOne({ id: parseInt(id) });

        // Check if post exists
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        // Check if the authenticated user is the author of the post
        if (post.author.username !== req.user.username) {
            return res.status(403).json({ message: 'You are not authorized to delete this post.' });
        }

        // Delete post
        await Post.findOneAndDelete({ id: parseInt(id) });

        res.status(204).send(); // No content on successful deletion
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        // Check if user exists and if the password is correct
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Generate a JWT token
        const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
});

// Signup endpoint
app.post('/api/signup', async (req, res) => {
    const { username, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email, and password are required.' });
    }

    try {
        // Check if a user with the same username or email already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists.' });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword, // Store the hashed password
        });

        await newUser.save();

        // Send a success response
        res.status(201).json({ message: 'User created successfully', user: { username, email } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
});

// PUT endpoint to update a user's account (excluding password)
app.put('/api/users', authenticateToken, async (req, res) => {
    const { username, email, firstName, lastName } = req.body;

    // Make sure the user is authenticated and the token is valid
    const { username: loggedInUsername } = req.user; // Extract username from the token

    // Check if the user sent any field to update
    if (!username && !email && !firstName && !lastName) {
        return res.status(400).json({ message: 'At least one field (username, email, firstName, lastName) is required.' });
    }

    try {
        // Check if the new username or email already exists (excluding the current user's data)
        const existingUser = await User.findOne({
            $or: [{ username, email }],
            _id: { $ne: req.user._id } // Exclude the logged-in user's current username and email
        });

        // If the new username or email is different from the current one, throw an error
        if (existingUser) {
            if (existingUser.username !== username || existingUser.email !== email) {
                return res.status(400).json({ message: 'Username or email is already taken.' });
            }
        }

        // Update the user fields
        const updatedUser = await User.findOneAndUpdate(
            { username: loggedInUsername }, // Ensure we're updating the correct user
            { username, email, firstName, lastName },
            { new: true, runValidators: true } // Return the updated user and validate before updating
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Return the updated user information (excluding password)
        const { password, ...userData } = updatedUser.toObject();
        res.json(userData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
});


// GET endpoint to fetch the authenticated user's details (excluding password)
app.get('/api/users/me', authenticateToken, async (req, res) => {
    try {
        // Fetch the user from the database using the authenticated user's username
        const user = await User.findOne({ username: req.user.username });

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Return user data excluding the password field
        const { password, ...userData } = user.toObject();
        res.json(userData);
      // Send back the user data without the password
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
