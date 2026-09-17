const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const requireAuth = require('../middleware/authMiddleware');
const requireAdmin = require('../middleware/adminMiddleware');

// Force all /api/admin routes through the double security checkpoint
router.use(requireAuth, requireAdmin);

router.get('/users', adminController.getAllUsers);
router.put('/users/:userId/toggle-status', adminController.toggleUserStatus);
router.get('/tasks', adminController.getAllTasks);
router.delete('/tasks/:taskId', adminController.deleteAnyTask);

module.exports = router;