const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer'); // Import multer
const path = require('path'); // Import path module
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve uploaded files from the 'uploads' directory

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory to save uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // File name format
    },
});

const upload = multer({ storage: storage });

// Database connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Mongoose schema for User
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // In a real application, consider hashing passwords
    email: { type: String, required: true, unique: true },
    image_file: { type: String },
});

// Mongoose model
const User = mongoose.model('User', userSchema);

// POST endpoint to create a new user
app.post('/api/users', upload.single('image_file'), async (req, res) => {
    const { username, password, email } = req.body;

    // Validate required fields
    if (!username || !password || !email) {
        return res.status(400).json({ message: 'Username, password, and email are required.' });
    }

    try {
        const newUser = new User({
            username,
            password, // In a real application, hash this before saving
            email,
            image_file: req.file ? req.file.path : null, // Save image file path if uploaded
        });
        
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        if (error.code === 11000) { // MongoDB duplicate key error
            return res.status(400).json({ username: 'Username or email already exists.' });
        }
        res.status(500).json({ message: 'Error creating user.' });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
