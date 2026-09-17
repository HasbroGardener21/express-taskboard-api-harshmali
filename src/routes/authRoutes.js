const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const requireAuth = require('../middleware/authMiddleware');

router.post('/login', authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/logout', requireAuth, authController.logout);
router.post('/register', authController.register);

module.exports = router;