const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const adminRoutes=require('./routes/admin')
const userRoutes=require('./routes/userRoutes')
const donationRoutes = require('./routes/donationRoutes');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: 'http://localhost:5173'
}));
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
const uri = process.env.MONGO_URI;

if (!uri) {
  console.error("MongoDB URI not found in environment variables.");
  process.exit(1);
}

// Routes
app.use('/api/donations', donationRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

mongoose.connect(process.env.MONGO_URI, {
}).then(() => {
  console.log('MongoDB connected');
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
}).catch((err) => {
  console.error('DB connection error:', err);
});
