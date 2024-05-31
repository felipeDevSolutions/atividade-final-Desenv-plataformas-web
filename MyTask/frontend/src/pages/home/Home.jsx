import React from 'react';
import Layout from '../../components/layout/Layout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Home() {
  

  return (
    <Layout>
      <div>
        <h1>Gerenciador de Tarefas</h1>
        
        <ToastContainer />
      </div>
    </Layout>
  );
}

export default Home;