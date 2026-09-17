const mongoose = require('mongoose');

const adminActionLogSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    action: {
      type: String,
      required: true
    },
    targetType: {
      type: String,
      enum: ['user', 'task', 'project'],
      required: true
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('AdminActionLog', adminActionLogSchema);