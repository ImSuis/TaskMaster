const Task = require('../model/taskModel');
const User = require('../model/userModel');

//Get all tasks for logged in user
const getTasks = async (req, res) => {
  try {
    const userId = req.user.id; // extracted from JWT
    const tasks = await Task.findAll({ where: { userId } });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
};

// Create a new task
const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user.id;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const newTask = await Task.create({ title, description, userId });
    res.status(201).json({ message: 'Task created', task: newTask });
  } catch (error) {
    res.status(500).json({ message: 'Error creating task', error: error.message });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;

    const task = await Task.findOne({ where: { id: taskId, userId } });

    if (!task) {
      return res.status(404).json({ message: 'Task not found or not authorized' });
    }

    await task.destroy();
    res.status(200).json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
};

module.exports = {
  getTasks,
  createTask,
  deleteTask
};
