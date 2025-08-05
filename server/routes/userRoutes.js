const express = require('express');
const router = express.Router();
const user= require('../models/user')
const bcrypt = require('bcrypt')
const {verifyToken} =require('../middleware/auth')
const jwt = require('jsonwebtoken')
router.post('/signup' ,async (req , res)=>{
    const { username, email, password } = req.body;
    try {
        const existingUser=await user.findOne({email});
        if (existingUser) return res.status(400).json({ message: 'User already exists' });
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new user({ username, email, password: hashedPassword,isAdmin:false });
        await newUser.save();
        res.status(201).json({ message: 'Signup successful' })
    } catch (error) {
        console.log(error);
        res.json({error});
    }
})

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

router.get('/me', verifyToken, (req, res) => {
  res.json({
    id: req.user._id,
    username: req.user.username,
    email: req.user.email,
    isAdmin: req.user.isAdmin,
    createdAt: req.user.createdAt,
  });
});
module.exports=router;