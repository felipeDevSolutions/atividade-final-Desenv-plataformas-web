import React, { useContext, useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import { AuthContext } from '../../context/AuthContext'; 
import './Home.css'; 
import Alerts, { showSuccessToast, showErrorToast } from '../../components/layout/Alerts';

function Home() {
  const { currentUser, isLoading, error } = useContext(AuthContext); 
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/tasks', { // URL correta
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setTasks(data);
      } catch (err) {
        console.error('Erro ao carregar tarefas:', err);
        showErrorToast('Erro ao carregar tarefas!');
      }
    };
    fetchTasks();
  }, []);

  const handleNewTaskChange = (event) => {
    setNewTask(event.target.value);
  };

  const handleAddTask = async () => {
    if (newTask.trim() === '') {
      alert('Por favor, insira uma tarefa!');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task: newTask }),
      });
      if (response.ok) {
        const newTaskData = await response.json();
        setTasks([...tasks, newTaskData]);
        setNewTask('');
        showSuccessToast('Tarefa adicionada!');
      } else {
        showErrorToast('Erro ao adicionar tarefa!');
      }
    } catch (err) {
      console.error('Erro ao adicionar tarefa:', err);
      showErrorToast('Erro ao adicionar tarefa!');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setTasks(tasks.filter((task) => task.id !== taskId));
        showSuccessToast('Tarefa deletada!');
      } else {
        showErrorToast('Erro ao deletar tarefa!');
      }
    } catch (err) {
      console.error('Erro ao deletar tarefa:', err);
      showErrorToast('Erro ao deletar tarefa!');
    }
  };


  return (
    <Layout>
      <Alerts /> {/* Renderiza o componente Alerts */}
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h1>Gerenciador de Tarefas</h1>
            {/* Exibindo informações do usuário */}
            {currentUser && <p>Bem-vindo, {currentUser.email}!</p>} 
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Adicionar nova tarefa"
                value={newTask}
                onChange={handleNewTaskChange}
              />
              <button className="btn btn-primary" onClick={handleAddTask}>
                Adicionar
              </button>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            {isLoading ? (
              <p>Carregando tarefas...</p>
            ) : error ? (
              <p>Erro ao carregar tarefas: {error.message}</p>
            ) : (
              <ul className="list-group">
                {tasks.map((task) => (
                  <li key={task.id} className="list-group-item d-flex justify-content-between align-items-center">
                    {task.task}
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      Excluir
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Home;