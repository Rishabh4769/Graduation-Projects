// login api (fixed — matches User model and returns normalized user)
const userModel = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = require('express').Router();

// POST /api/login
router.post('/', async (req, res) => {
  const email = req.body.email || req.body.emailAddress || req.body.username;
  const password = req.body.password || req.body.userPassword;

  if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

  try {
    // find by emailAddress (User model stores email as `emailAddress`)
    const user = await userModel.findOne({ emailAddress: email.toLowerCase() });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const match = await bcrypt.compare(password, user.userPassword);
    if (!match) return res.status(401).json({ message: 'Invalid email or password' });

    const secret = process.env.JWT_SECRET || 'frolics_dev_secret';
    const token = jwt.sign({ id: user._id, role: user.role }, secret, { expiresIn: '7d' });

    // return normalized user shape expected by client
    res.json({ token, user: { id: user._id, userName: user.userName, email: user.emailAddress, role: user.role } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;