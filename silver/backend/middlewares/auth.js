const jwt = require('jsonwebtoken');
const i18n = require('i18n');
const User = require('../models/User');
const Log = require('../models/Log');

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

const auth = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    await Log.create({
      eventType: 'auth',
      status: 'failure',
      reason: i18n.__('auth.no_token'),
      email: null,
    });
    return res.status(401).json({ msg: i18n.__('auth.no_token') });
  }

  try {
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET);
    req.user = await User.findById(decoded.id).select('-password'); // Attach user to request, excluding password
    if (!req.user) {
      await Log.create({
        eventType: 'auth',
        status: 'failure',
        reason: i18n.__('auth.invalid_token') + ' (User not found)',
        userId: decoded.id,
      });
      return res.status(401).json({ msg: i18n.__('auth.invalid_token') });
    }
    next();
  } catch (err) {
    console.error(err.message);
    await Log.create({
      eventType: 'auth',
      status: 'failure',
      reason: i18n.__('auth.invalid_token') + `: ${err.message}`,
      email: null,
    });
    res.status(401).json({ msg: i18n.__('auth.invalid_token') });
  }
};

module.exports = auth; 