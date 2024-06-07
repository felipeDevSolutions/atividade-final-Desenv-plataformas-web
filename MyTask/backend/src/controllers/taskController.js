const Task = require('../models/Task');
const authenticateToken = require('../middleware/authMiddleware');
const { db } = require('../../firebaseConfig');

const taskController = {
  // Cria uma nova tarefa
  async create(req, res) {
    try {
      const { task } = req.body;
      const newTask = await Task.create(req.user.id, { task });
      res.status(201).json(newTask);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar tarefa.' });
    }
  },

  // Recupera todas as tarefas do usuário
  async getTasks(req, res) {
    try {
      const tasks = await Task.getByUser(req.user.id);
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao recuperar tarefas.' });
    }
  },

  // Exclui uma tarefa
  async deleteTask(req, res) {
    try {
      const taskId = req.params.taskId;
      await Task.delete(req.user.id, taskId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Erro ao excluir tarefa.' });
    }
  },

  // Marca uma tarefa como concluída ou não concluída
  async toggleComplete(req, res) {
    try {
      const taskId = req.params.taskId;
      const taskRef = db.collection('users').doc(req.user.id).collection('tasks').doc(taskId);

      // Obtenha o status atual da tarefa
      const currentTask = await taskRef.get();

      // Verifica se a tarefa existe
      if (currentTask.exists) {
        const currentCompleted = currentTask.data().completed; // Obter o valor atual de completed

        // Atualiza o status da tarefa com o valor inverso
        await taskRef.update({ completed: !currentCompleted }); 
        res.status(204).send();
      } else {
        res.status(404).json({ message: 'Tarefa não encontrada.' }); 
      }
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar tarefa.' });
    }
  }
};

module.exports = taskController;