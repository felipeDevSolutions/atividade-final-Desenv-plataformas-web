const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authenticateToken = require('../middleware/authMiddleware');

// Cria uma nova tarefa
router.post('/', authenticateToken, taskController.create);

// Recupera todas as tarefas do usuário
router.get('/', authenticateToken, taskController.getTasks);

// Marca uma tarefa como concluída ou não concluída
router.put('/:taskId/complete', authenticateToken, taskController.toggleComplete);

// Exclui uma tarefa
router.delete('/:taskId', authenticateToken, taskController.deleteTask);

module.exports = router;