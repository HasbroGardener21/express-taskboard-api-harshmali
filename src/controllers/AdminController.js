const User = require('../models/User');
const Task = require('../models/Task');
const AdminActionLog = require('../models/AdminActionLog');

exports.getAllUsers = async (req, res) => {
  try {
    // Exclude passwords from the response for security
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    // Basic filter example: /api/admin/tasks?status=completed
    const filter = req.query.status ? { status: req.query.status } : {};
    const tasks = await Task.find(filter).populate('user', 'email');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
};

exports.deleteAnyTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.taskId);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Optional: Log this deletion in AdminActionLog here like you did for users
    res.json({ message: 'Task forcefully deleted by admin' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete task' });
  }
};


exports.toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') return res.status(403).json({ message: 'Cannot deactivate another admin' });

    user.isActive = !user.isActive;
    await user.save();

    // Generate the audit trail
    await AdminActionLog.create({
      adminId: req.user.id,
      action: user.isActive ? 'REACTIVATE_USER' : 'DEACTIVATE_USER',
      targetId: user._id,
      targetModel: 'User'
    });

    res.json({ 
      message: `User account ${user.isActive ? 'reactivated' : 'deactivated'}`, 
      isActive: user.isActive 
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user status' });
  }
};