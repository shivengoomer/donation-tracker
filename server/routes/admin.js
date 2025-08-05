
const { verifyToken, isAdmin } = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/',verifyToken,isAdmin, async (req, res) => {
  try {
    const users = await User.find(); 
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
