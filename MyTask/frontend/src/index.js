import React from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importando o CSS do Bootstrap
import App from './App';
import { AuthContextProvider } from './context/AuthContext'; // Importando o provedor de contexto

// Pegando o elemento DOM onde a aplicação será montada
const container = document.getElementById('root');
const root = createRoot(container);

// Renderizando o componente App dentro do provedor de contexto AuthContextProvider
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </React.StrictMode>
);
