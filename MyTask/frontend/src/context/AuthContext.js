import { createContext, useEffect, useReducer } from "react";
import AuthReducer from "./AuthReducer";

const INITIAL_STATE = {
  currentUser: null,
  isLoading: true,
  error: null,
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const validateToken = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/validate', { // URL correta
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Token inválido!');
        }

        const responseData = await response.json();
        dispatch({ type: "LOGIN", payload: responseData.user }); 
      } catch (err) {
        console.error('Erro ao validar token:', err);
        dispatch({ type: "LOGOUT" }); 
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    if (token) {
      validateToken();
    } else {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser: state.currentUser, isLoading: state.isLoading, error: state.error, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};