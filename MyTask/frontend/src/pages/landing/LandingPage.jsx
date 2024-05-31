import React from 'react';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();

  const handleGoToLogin = () => {
    navigate('/login');
  };

  const handleGoToSignup = () => {
    navigate('/signup');
  };

  return (
    <div className="container">
      <div className='header'>
        <div className='nav'>
          <div className="nav-bar">
            <div className="bg"></div>
            <li><a className="nav-link active" href="#home">Home</a></li>
            <li><a className="nav-link" href="#projects" onClick={handleGoToLogin}>Login</a></li>
            <li><a className="nav-link" href="#signup" onClick={handleGoToSignup}>Signup</a></li>
            <li><a className="nav-link" href="#contact">Contato</a></li>
          </div>
        </div>
      </div>
      <main>
        <div id="home">
          <div className="filter"></div>
          <section className="intro">
            <h3>Lista de Tarefas</h3>
            <h4>Organize seu trabalho de forma eficiente</h4>
            <hr />
            <p>Crie, gerencie e acompanhe suas tarefas com facilidade.</p>
            <p>Registre suas atividades e mantenha-se produtivo!</p>
            <div className="social-media">
              <a href="https://github.com/felipeDevSolutions" target="_blank" rel="noreferrer">
                <i className='fab fa-github'></i>
              </a>
              <a href="https://www.linkedin.com/in/felipercostadeveloper/" target="_blank" rel="noreferrer">
                <i className='fab fa-linkedin-in'></i>
              </a>
              <a href="https://www.youtube.com/channel/UCblinmn6DLcGuyJa299OlOQ" target="_blank" rel="noreferrer">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default LandingPage;
