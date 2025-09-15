const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
  eventType: {
    type: String,
    required: true,
    enum: ['signup', 'signin', 'me', 'auth', 'logout'],
  },
  status: {
    type: String,
    required: true,
    enum: ['success', 'failure'],
  },
  reason: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  email: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Log', LogSchema); 