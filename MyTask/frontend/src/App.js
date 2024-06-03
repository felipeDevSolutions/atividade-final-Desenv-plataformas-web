import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LandingPage from './pages/landing/LandingPage';
import Login from './pages/auth/Login';
import Signup from './pages/auth/signup';
import Home from './pages/home/Home'; 
import AdminPanel from './components/Admin/AdminPanel';
import EditUser from './components/Admin/EditUser';
import { AuthContext } from './context/AuthContext';
import ForgotPassword from './pages/auth/ForgotPassword';
import Loading from './components/Loading/Loading';
import Terms from './pages/utils/terms'; // Importa a página Terms.jsx

const RequireAuth = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  let location = useLocation();

  if (!currentUser) {
    return <Navigate to="/" state={{ from: location }} />;
  }

  return children;
};

function App() {
  const { currentUser, isLoading } = useContext(AuthContext); 

  return (
    <div className="app">
      {isLoading ? ( 
        <Loading /> 
      ) : (
        <Router>
          <Routes>
            <Route index element={currentUser ? <Navigate to="/home" /> : <LandingPage />} />
            <Route path="/login" element={currentUser ? <Navigate to="/home" /> : <Login />} />
            <Route path="/signup" element={currentUser ? <Navigate to="/home" /> : <Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} /> 
            <Route path="/home" element={<RequireAuth><Home /></RequireAuth>} />
            <Route path="/admin" element={<RequireAuth><AdminPanel /></RequireAuth>} />
            <Route path="/users/:userId/edit" element={<RequireAuth><EditUser /></RequireAuth>} />
            <Route path="/terms" element={<Terms />} /> 
          </Routes>
        </Router>
      )}
    </div>
  );
}

export default App;