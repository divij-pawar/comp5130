//server.js

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors'); // Import cors
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // Allow requests from this origin
    credentials: true // Allow credentials (like cookies) to be included in requests
}));
app.use(express.json());

// Debugging middleware to log request headers
app.use((req, res, next) => {
    next(); // Proceed to the next middleware or route handler
});

// Database connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Mongoose schema for Post
const postSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    price: { type: Number, required: true },
    date_posted: { type: Date, required: true },
    location: { type: String, required: true },
    author: {
        username: { type: String, required: true },
        image_file: { type: String, required: true },
    },
    image_file: { type: String, required: true },
});

// Mongoose schema for User
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // In a real application, passwords should be hashed
    email: { type: String, required: true, unique: true },
    image_file: { type: String },
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
app.post('/api/posts', async (req, res) => {
    const { id, title, content, price, date_posted, location, author, image_file } = req.body;

    // Validate required fields
    if (!id || !title || !content || !price || !date_posted || !location || !author || !image_file) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const newPost = new Post({
            id,
            title,
            content,
            price,
            date_posted: new Date(date_posted),
            location,
            author,
            image_file,
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
        const limit = parseInt(req.query.limit) || 5; // Default to 5 posts per page
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
app.put('/api/posts/:id', async (req, res) => {
    const { id } = req.params;
    const { title, content, price, date_posted, location, author, image_file } = req.body;

    try {
        const updatedPost = await Post.findOneAndUpdate(
            { id: parseInt(id) },
            { title, content, price, date_posted: new Date(date_posted), location, author, image_file },
            { new: true, runValidators: true }
        );

        if (!updatedPost) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        res.json(updatedPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
});

// DELETE endpoint to remove a post
app.delete('/api/posts/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedPost = await Post.findOneAndDelete({ id: parseInt(id) });

        if (!deletedPost) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
});

// POST endpoint to create a new user
app.post('/api/users', async (req, res) => {
    const { username, password, email, image_file } = req.body;

    // Validate required fields
    if (!username || !password || !email) {
        return res.status(400).json({ message: 'Username, password, and email are required.' });
    }

    try {
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            password: hashedPassword, // Store the hashed password
            email,
            image_file,
        });

        await newUser.save();
        res.status(201).json(newUser);
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

// Protect any routes that require authentication with the authenticateToken middleware
app.get('/api/protected', authenticateToken, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
