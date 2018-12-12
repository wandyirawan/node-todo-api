const mongoose = require('mongoose');

const User = mongoose.model('User', {
  email: {
    type: String,
    require: true,
    trim: true,
    minlength: 5,
  },
  createdAt: {
    type: Number,
    default: false,
  },
});

module.exports = {
  User,
};
