const express = require('express');
const router = express.Router();
const Donation = require('../models/donation');

// POST /api/donations - Add a new donation
router.post('/', async (req, res) => {
  try {
    const newDonation = new Donation(req.body);
    const savedDonation = await newDonation.save();
    res.status(201).json(savedDonation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/donations - Get all donations
router.get('/', async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.json(donations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/donations/:id - Update a donation
router.put('/:id', async (req, res) => {
  try {
    const updatedDonation = await Donation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedDonation) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    res.json(updatedDonation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/donations/:id - Delete a donation
router.delete('/:id', async (req, res) => {
  try {
    const deletedDonation = await Donation.findByIdAndDelete(req.params.id);

    if (!deletedDonation) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    res.json({ message: 'Donation deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
