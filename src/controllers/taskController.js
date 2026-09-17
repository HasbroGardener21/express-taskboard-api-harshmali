const Task = require('../models/Task')

// GET /api/tasks
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ order: 1 })
    res.json(tasks)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

// POST /api/tasks
const createTask = async (req, res) => {
  try {
    const { title, project } = req.body

    if (!title || title.trim().length < 3) {
      return res.status(400).json({ message: 'Title must be at least 3 characters' })
    }

    const taskCount = await Task.countDocuments({ user: req.user.id })

    const task = await Task.create({
      title: title.trim(),
      project: project || 'Inbox',
      user: req.user.id,
      order: taskCount
    })

    res.status(201).json(task)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

// GET /api/tasks/:id
const getTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id })
    if (!task) return res.status(404).json({ message: 'Task not found' })
    res.json(task)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

// PUT /api/tasks/:id
const updateTask = async (req, res) => {
  try {
    const { title, project, order } = req.body

    if (title && title.trim().length < 3) {
      return res.status(400).json({ message: 'Title must be at least 3 characters' })
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { title: title?.trim(), project, order },
      { new: true, runValidators: true }
    )

    if (!task) return res.status(404).json({ message: 'Task not found' })
    res.json(task)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

// PATCH /api/tasks/:id/complete
const toggleComplete = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id })
    if (!task) return res.status(404).json({ message: 'Task not found' })

    task.done = !task.done
    await task.save()

    res.json(task)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

// DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id })
    if (!task) return res.status(404).json({ message: 'Task not found' })
    res.json({ message: 'Task deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
}

module.exports = { getTasks, createTask, getTask, updateTask, toggleComplete, deleteTask }