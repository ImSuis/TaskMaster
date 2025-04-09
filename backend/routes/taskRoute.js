const express = require('express');
const { getTasks, createTask, deleteTask } = require('../controllers/taskController');
const { authGuard } = require('../middleware/authGuard');

const router = express.Router();

router.get('/', authGuard, getTasks); // Get all tasks for logged in user
router.post('/', authGuard, createTask); 
router.delete('/:id', authGuard, deleteTask); 
module.exports = router;