import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Layout.css';

const Layout = ({ children }) => {
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
            {children}  
          </section>
        </div>
      </main>
    </div>
  );
}

export default Layout;
