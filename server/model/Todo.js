const mongoose = require('mongoose');

const Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true,
    minlenght: 1,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  completeAt: {
    type: Number,
    default: false,
  },
});

module.exports = {
  Todo,
};
