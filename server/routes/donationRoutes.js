const express = require('express');
const router = express.Router();
const Donation = require('../models/donation');
router.post('/',   async (req, res) => {
  try {
    const newDonation = new Donation({...req.body,
      userId: req.user._id,
    });
    const savedDonation = await newDonation.save();
    res.status(201).json(savedDonation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
router.get('/',   async (req, res) => {
  try {
    let donations;
    if (req.user.isAdmin) {
      donations = await Donation.find()
        .populate('userId', 'username email')
        .sort({ createdAt: -1 });
    } else {
      donations = await Donation.find({ userId: req.user.id }).sort({ createdAt: -1 });
      
    }

    res.json(donations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id',   async (req, res) => {
  try {
    const filter = req.user.isAdmin
      ? { _id: req.params.id }
      : { _id: req.params.id, userId: req.user._id };

    const updatedDonation = await Donation.findOneAndUpdate(filter, req.body, { new: true });

    if (!updatedDonation) {
      return res.status(404).json({ error: 'Donation not found or access denied' });
    }

    res.json(updatedDonation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.delete('/:id',   async (req, res) => {
  try {
    const filter = req.user.isAdmin
      ? { _id: req.params.id }
      : { _id: req.params.id, userId: req.user._id };

    const deletedDonation = await Donation.findOneAndDelete(filter);

    if (!deletedDonation) {
      return res.status(404).json({ error: 'Donation not found or access denied' });
    }

    res.json({ message: 'Donation deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
