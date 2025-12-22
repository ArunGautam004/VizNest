import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Fetch user profile to validate token
      axios.get('http://localhost:5000/api/auth/profile') // Add this endpoint if needed, or use stored data
        .then(res => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        });
      setUser({ 
        name: localStorage.getItem('userName'), 
        email: localStorage.getItem('userEmail'), 
        isAdmin: localStorage.getItem('isAdmin') === 'true' 
      });
    }
    setLoading(false);
  }, []);

  // Axios interceptor for 401
  axios.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        setUser(null);
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  const register = async (name, email, password) => {
      try {
        setError('');
        const res = await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
        const { token, isAdmin } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('userName', name);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('isAdmin', isAdmin);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser({ name, email, isAdmin });
        console.log('Registration successful:', res.data); // Debug
      } catch (err) {
        const errMsg = err.response?.data?.message || 'Server error during registration';
        setError(errMsg);
        console.error('Registration failed:', errMsg); // Debug
        throw err;
      }
    };

    const login = async (email, password) => {
      try {
        setError('');
        const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
        const { token, name, isAdmin } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('userName', name);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('isAdmin', isAdmin);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser({ name: res.data.name, email, isAdmin });
        console.log('Login successful:', res.data); // Debug
      } catch (err) {
        const errMsg = err.response?.data?.message || 'Server error during login';
        setError(errMsg);
        console.error('Login failed:', errMsg); // Debug
        throw err;
      }
    };
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('isAdmin');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setError('');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);