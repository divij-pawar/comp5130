const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());

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
    password: { type: String, required: true }, // In a real application, consider hashing passwords
    email: { type: String, required: true, unique: true },
    image_file: { type: String },
});

// Mongoose models
const Post = mongoose.model('Post', postSchema);
const User = mongoose.model('User', userSchema);

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
      // Get the page and limit from query parameters
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5; // Default to 5 posts per page
  
      // Calculate how many posts to skip based on the current page
      const skip = (page - 1) * limit;
  
      // Get the total number of posts
      const totalPosts = await Post.countDocuments();
  
      // Fetch the posts for the current page
      const posts = await Post.find().skip(skip).limit(limit);
  
      // Calculate the total number of pages
      const totalPages = Math.ceil(totalPosts / limit);
  
      // Return the posts and pagination info
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
        const newUser = new User({
            username,
            password, // In a real application, hash this before saving
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

// PUT endpoint to update an existing user
app.put('/api/users/:username', async (req, res) => {
    const { username } = req.params;
    const { password, email, image_file } = req.body;

    try {
        const updatedUser = await User.findOneAndUpdate(
            { username },
            { password, email, image_file },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
});

// DELETE endpoint to remove a user
app.delete('/api/users/:username', async (req, res) => {
    const { username } = req.params;

    try {
        const deletedUser = await User.findOneAndDelete({ username });

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(204).send();
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
