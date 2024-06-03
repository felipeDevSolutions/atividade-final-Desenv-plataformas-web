import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'; 

function LandingPage() {
  const navigate = useNavigate();
  const { currentUser, isLoading, error } = useContext(AuthContext); 

  const handleGoToLogin = () => {
    navigate('/login');
  };

  const handleGoToSignup = () => {
    navigate('/signup');
  };

  const handleGoToLandingPage = () => {
    navigate('/');
  };

  return (
    <div className="container">
      <div className='header'>
        <div className='nav'>
          <div className="nav-bar">
            <div className="bg"></div>
            <li><a className="nav-link active" href="/" onClick={handleGoToLandingPage}>LandingPage</a></li>
            {/* Exibe o botão Login se o usuário não estiver logado e não estiver carregando */}
            {!currentUser && !isLoading && <li><a className="nav-link" href="/login" onClick={handleGoToLogin}>Login</a></li>}
            {/* Exibe o botão Signup se o usuário não estiver logado e não estiver carregando */}
            {!currentUser && !isLoading && <li><a className="nav-link" href="/signup" onClick={handleGoToSignup}>Signup</a></li>}
            {/* Exibe o botão Home se o usuário estiver logado e não estiver carregando */}
            {currentUser && !isLoading && <li><a className="nav-link" href="/" onClick={handleGoToLandingPage}>Home</a></li>}
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

        {/* Exibe a mensagem de erro se houver */}
        {error && <div className="error-message">{error}</div>} 
      </main>
    </div>
  );
}

export default LandingPage;