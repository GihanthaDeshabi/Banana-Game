import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';


import LandingPage from './components/Landing/LandingPage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import BananaGame from './components/games/BananaGame';
import MathGame from './components/games/MathGame';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/game" 
                element={
                  <ProtectedRoute>
                    <BananaGame />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/math-game" 
                element={
                  <ProtectedRoute>
                    <MathGame />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;