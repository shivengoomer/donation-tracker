const jwt = require('jsonwebtoken');
const User = require('../models/user');


const verifyToken = async (req, res, next) => {
  const token = req.cookies.token; 
  if (!token) {
    return res.status(401).json({ message: 'Access Denied: No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT);
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' ,error:err});
  }
};
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized: No user info found' });
  }

  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }

  next();
};

module.exports = { verifyToken, isAdmin };
