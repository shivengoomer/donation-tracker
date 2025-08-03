const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors({
  origin: 'http://localhost:5173'
}));
app.use(express.json());
const uri = process.env.MONGO_URI;

if (!uri) {
  console.error("MongoDB URI not found in environment variables.");
  process.exit(1);
}

// Routes
const donationRoutes = require('./routes/donationRoutes');
app.use('/api/donations', donationRoutes);

mongoose.connect(process.env.MONGO_URI, {
}).then(() => {
  console.log('MongoDB connected');
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
}).catch((err) => {
  console.error('DB connection error:', err);
});
