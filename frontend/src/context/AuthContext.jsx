import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const decoded = jwtDecode(token);
            // Check if token is expired
            if (decoded.exp * 1000 < Date.now()) {
                logout();
            } else {
                setUser({ id: decoded.user_id, role: decoded.role });
                setAuthToken(token);
            }
        } catch (e) {
            logout();
        }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
        const res = await axios.post('/api/auth/login', { username, password });
        const { token, role } = res.data;
        
        localStorage.setItem('token', token);
        const decoded = jwtDecode(token);
        setUser({ id: decoded.user_id, role });
        setAuthToken(token);
        return true;
    } catch (err) {
        console.error('Login error', err);
        return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setAuthToken(null);
  };

  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
