const express = require('express');
const router = express.Router();
const user= require('../models/user')
const bcrypt = require('bcrypt')
const {verifyToken, isAdmin} =require('../middleware/auth')
const jwt = require('jsonwebtoken')
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await user.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new user({ username, email, password: hashedPassword, isAdmin: false });
    await newUser.save();

    // 🔐 Generate token like in login
    const token = jwt.sign(
      { id: newUser._id, isAdmin: newUser.isAdmin },
      process.env.JWT
    );

    // 🍪 Set token cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,       // Set to true in production with HTTPS
      sameSite: 'Strict',
    });

    // ✅ Return user info or success
    res.status(201).json({ message: 'Signup successful', token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Signup failed', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const testUser = await user.findOne({ username });
    if (!testUser) {
      return res.status(400).json({ message: 'User not found' });
    }
    const isMatch = await bcrypt.compare(password, testUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Wrong credentials!' });
    }

    const token = jwt.sign(
      { id: testUser._id, isAdmin: testUser.isAdmin },
      process.env.JWT ,
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'Strict',
    });

    return res.status(200).json({ message: 'Login successful', token });

  } catch (error) {
    return res.status(500).json({ message: 'Login failed', error: error.message });
  }
});
router.get('/me',verifyToken, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token payload' });
    }

    const User = await user.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found in database' });
    }

    if (User.isAdmin) {
      const allUsers = await user.find().select('-password');
      return res.json({ isAdmin: true, users: allUsers });
    }

    res.json({User});
  }catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});



router.post('/logout', (req, res) => {
  res.clearCookie('token').status(200).json({ message: 'Logged out successfully' });
});

module.exports=router;