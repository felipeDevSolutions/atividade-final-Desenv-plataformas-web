import React, { useContext, useState } from "react";
import axios from 'axios';
import Layout from '../../components/layout/Layout';
import "../auth/login.css";
import "../auth/form.css"; // Importando o CSS compartilhado
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/login', { email, password });
      
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      dispatch({ type: "LOGIN", payload: user });
      navigate("/home");
    } catch (error) {
      console.error("Error logging in: ", error);
      alert("Credenciais inválidas. Verifique o usuário e senha ou faça seu cadastro.");
    }
  }

  return (
    <Layout>
      <div className="form-popup">
        <div className="form-box">
          <div className="form-content">
            <h2>LOGIN</h2>
            <form onSubmit={handleLogin} method="post">
              <div className="input-field">
                <input
                  type="text"
                  id="loginEmail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label htmlFor="loginEmail">Email</label>
              </div>
              <div className="input-field">
                <input
                  type="password"
                  id="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <label htmlFor="Password">Senha</label>
              </div>
              <button type="submit">Entrar</button>
              <div className="bottom-link">
                Ainda não criou sua conta?
                <a href="/signup" id="signup-link"> Criar conta</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Login;
