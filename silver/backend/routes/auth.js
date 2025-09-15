const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Log = require('../models/Log');
const loginLimiter = require('../middlewares/rateLimiter');
const { validateSignup, validateSignin, validate } = require('../middlewares/validator');
const auth = require('../middlewares/auth'); // Import auth middleware
const i18n = require('i18n');

// Environment variables
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

// Generate Access Token
const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id }, JWT_ACCESS_SECRET, { expiresIn: '30d' });
};

// Helper function to log events
const logEvent = async (eventType, status, reason, userId = null, email = null) => {
  const log = new Log({
    eventType,
    status,
    reason,
    userId,
    email,
  });
  await log.save();
};

// @route   POST api/auth/signup
// @desc    Register user
// @access  Public
router.post(
  '/signup',
  loginLimiter,
  validateSignup,
  validate,
  async (req, res) => {
    const { name, phone, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        await logEvent('signup', 'failure', req.__('user.exists'), null, email);
        return res.status(400).json({ msg: req.__('user.exists') });
      }

      user = new User({
        fullName: name,
        phoneNumber: phone,
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const accessToken = generateAccessToken(user);

      res.cookie('token', accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 30 * 24 * 60 * 60 * 1000 });

      await logEvent('signup', 'success', 'User successfully registered', user._id, email);
      res.status(201).json({ msg: req.__('user.registered_successfully') });
    } catch (err) {
      console.error(err.message);
      await logEvent('signup', 'failure', err.message, null, email);
      res.status(500).send(req.__('server_error'));
    }
  }
);

// @route   POST api/auth/signin
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/signin',
  loginLimiter,
  validateSignin,
  validate,
  async (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        await logEvent('signin', 'failure', req.__('user.invalid_credentials'), null, email);
        return res.status(400).json({ msg: req.__('user.invalid_credentials') });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        await logEvent('signin', 'failure', req.__('user.invalid_credentials'), user._id, email);
        return res.status(400).json({ msg: req.__('user.invalid_credentials') });
      }

      const accessToken = generateAccessToken(user);

      res.cookie('token', accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 30 * 24 * 60 * 60 * 1000 });

      await logEvent('signin', 'success', 'User successfully logged in', user._id, email);
      res.json({ msg: req.__('user.logged_in_successfully') });
    } catch (err) {
      console.error(err.message);
      await logEvent('signin', 'failure', err.message, null, email);
      res.status(500).send(req.__('server_error'));
    }
  }
);

// @route   GET api/auth/me
// @desc    Get user data
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    // req.user is populated by the auth middleware
    await logEvent('me', 'success', 'User data fetched', req.user._id, req.user.email);
    res.json(req.user);
  } catch (err) {
    console.error(err.message);
    await logEvent('me', 'failure', err.message, req.user ? req.user._id : null, req.user ? req.user.email : null);
    res.status(500).send(req.__('server_error'));
  }
});

// @route   GET api/auth/logout
// @desc    Logout user (clear cookie)
// @access  Private
router.get('/logout', auth, async (req, res) => {
  try {
    res.clearCookie('token');
    await logEvent('logout', 'success', 'User logged out', req.user._id, req.user.email);
    res.json({ msg: req.__('user.logged_out_successfully') });
  } catch (err) {
    console.error(err.message);
    await logEvent('logout', 'failure', err.message, req.user ? req.user._id : null, req.user ? req.user.email : null);
    res.status(500).send(req.__('server_error'));
  }
});

module.exports = router; 