const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  resetToken: {
    type: String,
    default: null
  },
  emailVerificationTokenExpiry: {
    type: Date,
    default: null
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  teams: [
    {
      team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team'
      },
      role: {
        type: String,
        enum: ['creator', 'member'],
        default: 'member'
      }
    }
  ]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
