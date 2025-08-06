
const { verifyToken, isAdmin } = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const User = require('../models/user');


router.get('/admin/donations', verifyToken, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }

    const donations = await Donation.find().populate('user', 'username email').sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all donations', error });
  }
});


module.exports = router;
