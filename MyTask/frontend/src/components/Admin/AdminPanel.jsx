import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import './AdminPanel.css'; 
import Loading from '../../components/Loading/Loading';
import Alerts, { showSuccessToast, showErrorToast } from '../../components/layout/Alerts'; 

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
        setIsLoading(false); 
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        showErrorToast('Erro ao carregar usuários!');
      }
    };
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(users.filter((user) => user.id !== userId));
      showSuccessToast('Usuário deletado com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      showErrorToast('Erro ao deletar usuário!');
    }
  };

  return (
    <Layout>
      <Alerts /> 
      {isLoading && <Loading />} 
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h1>Painel de Administração</h1>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.email}</td>
                    <td>
                      <Link to={`/users/${user.id}/edit`} className="btn btn-primary btn-sm mr-2">
                        Editar
                      </Link>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminPanel;