import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Layout from '../../components/layout/Layout';
import './Project.css'; 
import Alerts, { showSuccessToast, showErrorToast } from '../../components/layout/Alerts';

const Project = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [newSectionName, setNewSectionName] = useState('');
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [projectName, setProjectName] = useState('')
  const addSectionFormRef = useRef(null); // Referência para o formulário de adicionar seção

  useEffect(() => {
    if (projectId){
      const fetchProjectName = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
    
          if (response.ok) {
            const projectData = await response.json();
            setProjectName(projectData.project);
          } else {
            console.error('Erro ao buscar o nome do projeto.');
            // Opcional: Exibir um erro ao usuário (ex.: showErrorToast)
          }
        } catch (err) {
          console.error('Erro ao buscar o nome do projeto:', err);
          // Opcional: Exibir um erro ao usuário (ex.: showErrorToast)
        }
      };
      fetchProjectName();
    };  
  }, [projectId]);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/projects/${projectId}/sections`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setSections(data);
      } catch (err) {
        console.error('Erro ao carregar seções:', err);
        showErrorToast('Erro ao carregar seções.');
      }
    };

    fetchSections();
  }, [projectId]); 

  const handleAddSection = async () => {
    if (newSectionName.trim() !== '') {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/projects/${projectId}/sections`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: newSectionName }),
        });

        if (response.ok) {
          const newSection = await response.json();
          setSections([...sections, newSection]);
          setNewSectionName('');
          setIsAddingSection(false)
        } else {
          console.error('Erro ao adicionar seção.');
        }
      } catch (err) {
        console.error('Erro ao adicionar seção:', err);
      }
    }
  };

  const handleDeleteSection = async (sectionId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:5000/api/projects/${projectId}/sections/${sectionId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setSections(sections.filter((section) => section.id !== sectionId));
      } else {
        console.error('Erro ao excluir seção.');
      }
    } catch (err) {
      console.error('Erro ao excluir seção:', err);
    }
  };

  useEffect(() => {
    // Função para lidar com cliques fora do formulário de adicionar lista
    const handleClickOutside = (event) => {
      if (
        addSectionFormRef.current &&
      !addSectionFormRef.current.contains(event.target) && 
      !event.target.classList.contains('add-section-input') &&
      !event.target.classList.contains('add-section-button-salvar') 
      ) {
        setIsAddingSection(false); // Fecha o formulário ao clicar fora
      }
    };

    // Adiciona o event listener quando o componente monta
    document.addEventListener('mousedown', handleClickOutside);

    // Remove o event listener quando o componente desmonta
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [addSectionFormRef]); // Monitora a referência para garantir atualização

  return (
    <Layout> 
      <Alerts /> 
      <div className="project-container">
        <h1>{projectName}</h1> 

        

        <div className="sections-container" ref={addSectionFormRef}>
          {sections.map((section) => (
            <SectionColumn
              key={section.id}
              section={section}
              onDelete={handleDeleteSection}
              projectId={projectId}
            />
          ))}

          {/* Botão e Formulário de Adicionar Lista */}
          {!isAddingSection ? (
            <button className="add-section-button" onClick={() => setIsAddingSection(true)} >
              Adicionar lista
            </button>
          ) : (
            <div className="add-section-form animate-slide-in" > {/* Classe de animação adicionada */}
              <input
                type="text"
                placeholder="Nome da lista"
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
                className="add-section-input"
                ref={addSectionFormRef}
              />
              <div className="add-section-buttons" >
                <button 
                  className='add-section-button-salvar'
                  ref={addSectionFormRef} 
                  onClick={handleAddSection}>
                  Salvar
                </button>
                <button 
                  ref={addSectionFormRef} 
                  onClick={() => setIsAddingSection(false)}>
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

const SectionColumn = ({ section, onDelete, projectId }) => {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false); 
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = currentUser ? currentUser.id : null; // Obtenha o userId do contexto

        if (!userId) {
          console.error('Usuário não autenticado!');
          return; // Não faça a requisição se não houver userId
        }

        const response = await fetch(
          `http://localhost:5000/api/projects/${projectId}/sections/${section.id}/tasks`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setTasks(data);
      } catch (err) {
        console.error('Erro ao carregar tarefas:', err);
      }
    };

    fetchTasks();
  }, [projectId, section.id, currentUser]);

  const handleAddTask = async () => {
    if (newTaskTitle.trim() !== '') {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `http://localhost:5000/api/projects/${projectId}/sections/${section.id}/tasks`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: newTaskTitle }),
          }
        );

        if (response.ok) {
          const newTask = await response.json();
          setTasks([...tasks, newTask]);
          setNewTaskTitle(''); 
          setIsAddingTask(false); 
        } else {
          console.error('Erro ao adicionar tarefa.');
        }
      } catch (err) {
        console.error('Erro ao adicionar tarefa:', err);
      }
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:5000/api/projects/${projectId}/sections/${section.id}/tasks/${taskId}`, 
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setTasks(tasks.filter((task) => task.id !== taskId));
      } else {
        console.error('Erro ao excluir tarefa.');
      }
    } catch (err) {
      console.error('Erro ao excluir tarefa:', err);
    }
  };

  return (
    <div className="section-column">
      <div className='section-header'>
        <h2>{section.name}</h2>
        <button onClick={() => onDelete(section.id)}>Excluir Seção</button>
      </div>
      <div className="tasks-container">
        <div className="tasks-list">
          {tasks.map((task) => (
            <div key={task.id} className="task-card">
              {task.title}
              <button onClick={() => handleDeleteTask(task.id)}>Excluir</button>
            </div>
          ))}
        </div>
        {!isAddingTask && ( 
          <button className="add-task-button" onClick={() => setIsAddingTask(true)}>
            + Adicionar Tarefa
          </button>
        )}
        {isAddingTask && ( 
          <div className="add-task-form">
            <input
              type="text"
              placeholder="Título da Tarefa"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
            />
            <div className="add-task-buttons"> {/* Nova div para os botões */}
              <button onClick={handleAddTask}>Salvar</button>
              <button onClick={() => setIsAddingTask(false)}>Cancelar</button> {/* Botão Cancelar */}
            </div> 
          </div>
        )}
      </div>
    </div>
  );
};

export default Project;