const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  ngoName: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  transactionId: {
    type: String,
    required: true,
    unique: true,
  },
  date: {
    type: Date,
    required: true,
  },
  payeeName: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', 
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('donation', donationSchema);
