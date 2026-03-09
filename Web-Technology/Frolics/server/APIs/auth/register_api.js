const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../../models/User'); // adjust path to your model location

// POST /api/register
router.post('/', async (req, res) => {
  try {
    const { userName, emailAddress, userPassword, phoneNumber } = req.body;

    // 1. Basic input validation
    if (!userName || !emailAddress || !userPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide userName, emailAddress and userPassword',
      });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ emailAddress: emailAddress.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email address is already registered',
      });
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userPassword, salt);

    // 4. Create new user
    const newUser = new User({
      userName: userName.trim(),
      emailAddress: emailAddress.toLowerCase().trim(),
      userPassword: hashedPassword,
      phoneNumber: phoneNumber ? phoneNumber.trim() : undefined,
      // role defaults to "student"
      // isActive defaults to true
    });

    await newUser.save();

    // 5. Response (do NOT send password back!)
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        userName: newUser.userName,
        emailAddress: newUser.emailAddress,
        role: newUser.role,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    console.error('Register error:', error);

    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message,
    });
  }
});

module.exports = router;