const jwt = require('jsonwebtoken');
const User = require('../models/user');

const verifyToken = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Access Denied: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT);
    req.user = { id: decoded.id, isAdmin: decoded.isAdmin }; 
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token', error: err.message });
  }
};

module.exports = { verifyToken };
