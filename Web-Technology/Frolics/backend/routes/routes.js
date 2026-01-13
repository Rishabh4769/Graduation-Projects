const express = require('express');
const router = express.Router();

// Simple routes that render templates
router.get('/home', (req, res) => {
  res.render('index');
});

router.get('/signup', (req, res) => {
  res.render('auth/signup');
  next();
});

router.get('/login', (req, res) => {
  res.render('auth/login');
});

router.get('/dashboard', (req, res) => {
  res.render('users/userDashboard');
});


module.exports = router;