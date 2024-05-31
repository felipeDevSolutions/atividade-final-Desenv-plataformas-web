import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate  } from 'react-router-dom';
import LandingPage from './pages/landing/LandingPage';
import Login from './pages/auth/Login';
import Signup from './pages/auth/signup';
import Home from './pages/home/Home'; 
import { AuthContext } from "./context/AuthContext";

function App() {
  const { currentUser } = useContext(AuthContext);

  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/"/>;
  };

  return (
    <div className="app">
      <Router>
        <Routes>
          <Route index element={<LandingPage />}/>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<RequireAuth><Home /></RequireAuth>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;