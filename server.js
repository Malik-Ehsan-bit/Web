const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); // Serve static files from current directory

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/smartshop', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// User Schema
const userSchema = new mongoose.Schema({
  fullname: String,
  email: String,
  password: String,
});
const User = mongoose.model('User', userSchema);

// Sign Up API
app.post('/api/signup', async (req, res) => {
  const { fullname, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const newUser = new User({ fullname, email, password });
    await newUser.save();
    res.status(200).json({ message: 'User created' });
  } catch (err) {
    res.status(500).json({ error: 'Signup failed' });
  }
});

// Login API
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

const fs = require('fs');
const reviewsFile = path.join(__dirname, 'reviews.json');

// API to submit a review
app.post('/submit-review', (req, res) => {
  const newReview = {
    name: req.body.name,
    text: req.body.text,
    rating: req.body.rating,
    date: req.body.date,
  };

  fs.readFile(reviewsFile, 'utf8', (err, data) => {
    let reviews = [];
    if (!err && data) {
      try {
        reviews = JSON.parse(data);
      } catch (parseErr) {
        console.error('Error parsing reviews.json:', parseErr);
      }
    }

    reviews.unshift(newReview); // Add new review to top

    fs.writeFile(reviewsFile, JSON.stringify(reviews, null, 2), (err) => {
      if (err) {
        console.error('Error writing to reviews.json:', err);
        return res.status(500).send('Failed to save review.');
      }
      res.status(200).send('Review saved successfully.');
    });
  });
});

// API to get all reviews
app.get('/get-reviews', (req, res) => {
  fs.readFile(reviewsFile, 'utf8', (err, data) => {
    if (err) {
      return res.status(200).json([]); // Return empty array if file missing
    }

    try {
      const reviews = JSON.parse(data);
      res.status(200).json(reviews);
    } catch (parseErr) {
      console.error('Error parsing reviews.json:', parseErr);
      res.status(500).send('Failed to load reviews.');
    }
  });
});


// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
