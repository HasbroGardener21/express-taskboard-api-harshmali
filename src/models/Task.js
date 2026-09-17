const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3
  },
  done: {
    type: Boolean,
    default: false
  },
  project: {
    type: String,
    default: 'Inbox'
  },
  imageUrl: {
    type: String,
    default: null
  },
  order: {
    type: Number,
    default: 0
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('Task', taskSchema)