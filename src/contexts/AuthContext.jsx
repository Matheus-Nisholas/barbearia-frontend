import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('authToken'));
  
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('authToken', token);
      const decodedUser = jwtDecode(token);
      setUser(decodedUser);
    } else {
      localStorage.removeItem('authToken');
      setUser(null);
    }
  }, [token]);

  const login = async (login, password) => {
    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password }),
      });

      if (response.ok) {
        const receivedToken = await response.text();
        setToken(receivedToken);
      } else {
        throw new Error('Falha na autenticação');
      }
    } catch (error) {
      console.error("Erro na chamada de login:", error);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
  };

  const value = { token, user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}