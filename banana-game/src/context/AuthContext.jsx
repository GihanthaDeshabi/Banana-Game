// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Check if user is logged in on first load
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        axios.defaults.headers.common['x-auth-token'] = token;
        
        try {
          const res = await axios.get('http://localhost:5000/api/auth/me');
          setUser(res.data);
        } catch (error) {
          console.error('Error loading user:', error);
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['x-auth-token'];
        }
      }
      
      setLoading(false);
    };
    
    loadUser();
  }, []);
  
  // Register user
  const register = async (formData) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      
      // Set token and user
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['x-auth-token'] = res.data.token;
      setUser(res.data.user);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };
  
  // Login user
  const login = async (formData) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      
      // Set token and user
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['x-auth-token'] = res.data.token;
      setUser(res.data.user);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };
  
  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['x-auth-token'];
    setUser(null);
  };
  
  // Update high score
  const updateHighScore = async (score) => {
    try {
      const res = await axios.post('http://localhost:5000/api/scores/update', { score });
      
      // Update user with new high score
      setUser({ ...user, highScore: res.data.highScore });
      
      return { success: true, highScore: res.data.highScore };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update score' 
      };
    }
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        updateHighScore
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;