const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');

// Create a todo
router.post('/', async (req, res) => {
  const { title, priority, completed, userId } = req.body;
  try {
    const newTodo = new Todo({
      title,
      completed,
      priority,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await newTodo.save();
    res.json(newTodo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all todos for a user
router.get('/:userId', async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.params.userId });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a todo
router.put('/:id', async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a todo
router.delete('/:id', async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Todo deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
