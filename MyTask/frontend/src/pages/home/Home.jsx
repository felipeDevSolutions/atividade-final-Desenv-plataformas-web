import React, { useContext, useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import { AuthContext } from '../../context/AuthContext';
import './Home.css';
import Alerts, { showSuccessToast, showErrorToast } from '../../components/layout/Alerts';

function Home() {
  const { currentUser, isLoading, error } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/tasks', {
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

  const handleAddTask = async (event) => {
    event.preventDefault();
    if (newTask.trim() !== '') {
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

  const handleToggleTaskComplete = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}/complete`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const updatedTasks = tasks.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        );
        setTasks(updatedTasks);
        showSuccessToast('Tarefa concluída!');
      } else {
        showErrorToast('Erro ao atualizar tarefa!');
      }
    } catch (err) {
      console.error('Erro ao atualizar tarefa:', err);
      showErrorToast('Erro ao atualizar tarefa!');
    }
  };

  const handleShowCompleted = () => {
    setShowCompleted(!showCompleted);
  };

  return (
    <Layout>
      <Alerts />
      <div className="home-container">
        <div className="task-header">
          <div className="welcome-title">
            <h1>Gerenciador de Tarefas</h1>
            {currentUser && <p>Bem-vindo, {currentUser.email}!</p>}
          </div>
          <div className="add-task-input">
            <input
              type="text"
              className="form-control"
              placeholder="Adicionar nova tarefa"
              value={newTask}
              onChange={handleNewTaskChange}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && newTask.trim() !== '') {
                  event.preventDefault();
                  handleAddTask(event);
                }
              }}
            />
            <div className='btn-group-header'>
              <button className="btn btn-primary add-task-button" onClick={handleAddTask}>
                Adicionar
              </button>
              <button className={`toggle-completed-button btn ${showCompleted ? 'btn-orange' : 'btn-green'}`} onClick={handleShowCompleted}>
                {showCompleted ? 'Mostrar Pendentes' : 'Mostrar Concluídas'}
              </button>
            </div>
          </div>
        </div>

        <div className="task-list">
          <div className="col-12">
            {isLoading ? (
              <p>Carregando tarefas...</p>
            ) : error ? (
              <p>Erro ao carregar tarefas: {error.message}</p>
            ) : (
              <ul className="list-group">
                {tasks
                  .filter((task) => (showCompleted ? task.completed : !task.completed))
                  .map((task) => (
                    <li key={task.id} className="list-group-item task-item d-flex justify-content-between align-items-center">
                      {task.task}
                      <div>
                        <button
                          className="btn btn-success btn-sm mr-2 task-done-button"
                          onClick={() => handleToggleTaskComplete(task.id)}
                        >
                          Fiz
                        </button>
                        <button
                          className="btn btn-danger btn-sm task-delete-button"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          Excluir
                        </button>
                      </div>
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