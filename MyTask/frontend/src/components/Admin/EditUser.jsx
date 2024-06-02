import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../../components/layout/Layout';
import Loading from '../../components/Loading/Loading';
import Alerts, { showSuccessToast, showErrorToast } from '../../components/layout/Alerts';

function EditUser() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      showErrorToast("As senhas não estão iguais.");
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');

      await axios.put(`http://localhost:5000/api/users/${userId}/password`, { 
        oldPassword,
        newPassword,
        confirmPassword
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      showSuccessToast('Senha atualizada com sucesso!');
      navigate('/home');
    } catch (error) {
      console.error('Erro ao atualizar senha:', error);
      showErrorToast('Erro ao atualizar senha!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <Alerts />
      {isLoading && <Loading />}
      <div className="container">
        <h1>Atualizar Senha</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="oldPassword">Senha Antiga:</label>
            <input
              type="password"
              className="form-control"
              id="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">Nova Senha:</label>
            <input
              type="password"
              className="form-control"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Nova Senha:</label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Atualizar
          </button>
        </form>
      </div>
    </Layout>
  );
}

export default EditUser;