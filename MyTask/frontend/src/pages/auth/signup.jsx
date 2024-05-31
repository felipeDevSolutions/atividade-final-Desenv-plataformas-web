import { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Layout from '../../components/layout/Layout';
import "../auth/signup.css";
import "../auth/form.css"; // Importando o CSS compartilhado

const Signup = () => {
  const navigate = useNavigate();
  const [codigo, setCodigo] = useState("");
  const [emailSignup, setEmailSignup] = useState("");
  const [passwordSignup, setPasswordSignup] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [authorizationCode, setAuthorizationCode] = useState("");

  useEffect(() => {
    // Fetch authorization code when component mounts
    axios.get('http://localhost:5000/api/authorization-code')
      .then(response => {
        setAuthorizationCode(response.data.authorizationCode);
      })
      .catch(error => {
        console.error("Error fetching authorization code:", error);
      });
  }, []);

  const handleSignup = (e) => {
    e.preventDefault();

    if (codigo !== authorizationCode) {
      alert("Código de autorização incorreto.");
      return;
    }

    if (passwordSignup !== confirmPassword) {
      alert("As senhas não coincidem.");
      return;
    }

    axios.post('http://localhost:5000/api/signup', {
      authorizationCode: codigo,
      email: emailSignup,
      password: passwordSignup
    })
      .then(response => {
        alert("Usuário cadastrado com sucesso!");
        navigate("/login");
      })
      .catch(error => {
        if (error.response && error.response.data && error.response.data.message) {
          alert(error.response.data.message);
        } else {
          console.error("Error signing up: ", error);
          alert("Ocorreu um erro ao cadastrar o usuário. Por favor, tente novamente.");
        }
      });
  }

  return (
    <Layout>
      <hr />
      <div className="form-popup">
        <div className="form-box">
          <div className="form-content">
            <h2>CADASTRAR</h2>
            <form onSubmit={handleSignup}>
              <div className="input-field">
                <input
                  type="text"
                  id="signupCodigo"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  required
                />
                <label htmlFor="signupCodigo">Código de autorização</label>
              </div>
              <div className="input-field">
                <input
                  type="text"
                  id="signupEmail"
                  value={emailSignup}
                  onChange={(e) => setEmailSignup(e.target.value)}
                  required
                />
                <label htmlFor="signupEmail">Cadastrar email</label>
              </div>
              <div className="input-field">
                <input
                  type="password"
                  id="signupSenha"
                  value={passwordSignup}
                  onChange={(e) => setPasswordSignup(e.target.value)}
                  required
                />
                <label htmlFor="signupSenha">Criar senha</label>
              </div>
              <div className="input-field">
                <input
                  type="password"
                  id="signupConfirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <label htmlFor="signupConfirmPassword">Confirmar senha</label>
              </div>
              <button type="submit">Cadastrar</button>
              <div className="bottom-link">
                Já tem uma conta?
                <a href="/login" id="login-link"> Login</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Signup;
