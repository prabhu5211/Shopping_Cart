const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// POST /api/users - Create new user (Signup)
router.post('/', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send({ error: 'Username and password are required' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      password: hashedPassword
    });

    await user.save();
    res.status(201).send({ message: 'User created successfully', userId: user._id });
  } catch (error) {
    res.status(500).send({ error: 'Error creating user' });
  }
});

// POST /api/users/login - User login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send({ error: 'Username and password are required' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send({ error: 'Invalid username/password' });
    }

    // Check if user is already logged in on another device
    if (user.token) {
      return res.status(403).send({ error: 'You are already logged in on another device.' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).send({ error: 'Invalid username/password' });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    // Save token to DB to lock the session
    user.token = token;
    await user.save();

    res.send({ token, userId: user._id, username: user.username });
  } catch (error) {
    res.status(500).send({ error: 'Error during login' });
  }
});

// POST /api/users/logout - User logout
router.post('/logout', auth, async (req, res) => {
  try {
    req.user.token = null;
    await req.user.save();
    res.send({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).send({ error: 'Error during logout' });
  }
});

// GET /api/users - List all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password -token');
    res.send(users);
  } catch (error) {
    res.status(500).send({ error: 'Error fetching users' });
  }
});

module.exports = router;
