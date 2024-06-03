const { db, admin } = require('../../firebaseConfig');

const Task = {
  // Cria uma nova tarefa
  async create(userId, taskData) {
    try {
      const docRef = await db.collection('users').doc(userId).collection('tasks').add({
        task: taskData.task,
        completed: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Recupera a tarefa criada com o timestamp
      const taskDoc = await docRef.get();
      const task = {
        id: taskDoc.id,
        ...taskData,
        completed: false,
        createdAt: taskDoc.data().createdAt.toDate(), 
      };

      return task; 
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      throw error;
    }
  },

  // Recupera todas as tarefas de um usuário
  async getByUser(userId) {
    try {
      const tasksRef = db.collection('users').doc(userId).collection('tasks');
      const tasksSnapshot = await tasksRef.get();
      const tasks = [];

      tasksSnapshot.forEach(doc => {
        const task = {
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate(), // Converte o timestamp do Firestore para Date
        };
        tasks.push(task);
      });

      return tasks;
    } catch (error) {
      console.error('Erro ao recuperar tarefas:', error);
      throw error;
    }
  },

  // Exclui uma tarefa
  async delete(userId, taskId) {
    try {
      await db.collection('users').doc(userId).collection('tasks').doc(taskId).delete();
      return true;
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
      throw error;
    }
  }
};

module.exports = Task;