const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController'); // <-- Make sure this is here
const authMiddleware = require('../middleware/authMiddleware');
const { body } = require('express-validator');
const validate = require('../middleware/Validate');

// Protect all task routes
router.use(authMiddleware);

router.get('/', taskController.getTasks);

router.post('/', [
  body('title').notEmpty().withMessage('Title is required').trim().escape(),
  body('description').optional().trim().escape()
], validate, taskController.createTask);

router.delete('/:id', taskController.deleteTask);

module.exports = router;