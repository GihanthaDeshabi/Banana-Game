import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MathGame.css';

const MathGame = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [gameResult, setGameResult] = useState({ score: 0, passed: false });
  const navigate = useNavigate();
  
  const mathGameApiUrl = "https://marcconrad.com/uob/banana/";

  useEffect(() => {
    const userFromStorage = localStorage.getItem('user');
    const tokenFromStorage = localStorage.getItem('token');
    
    if (userFromStorage && tokenFromStorage) {
      setUser(JSON.parse(userFromStorage));
      setToken(tokenFromStorage);
      setIsLoading(false);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin !== new URL(mathGameApiUrl).origin) return;

      if (event.data.type === 'GAME_COMPLETE') {
        const { score, passed } = event.data;
        
        setGameComplete(true);
        setGameResult({ score, passed });
        
        saveScore(score, passed);
        
        if (passed) {
          setTimeout(() => {
            navigate('/game');
          }, 3000);
        } else { /*  */ }
      };
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [navigate, token, user]);

  const saveScore = async (score, passed) => {
    try {
      if (!token || !user) {
        throw new Error('Authentication required');
      }
      
      const response = await fetch('https://marcconrad.com/uob/banana/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: user.id,
          game: 'math-game',
          score: score,
          won: passed
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to save score');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error saving score:', error);
    }
  };

  const handleRetry = () => {
    setGameComplete(false);
    
    const iframe = document.querySelector('.math-game-iframe');
    if (iframe) {
      const originalSrc = iframe.src;
      iframe.src = '';
      iframe.src = originalSrc;
    }
  };

  if (isLoading) {
    return (
      <div className="math-loading-container">
        <div className="banana-bg"></div>
        <div className="math-loading-content">
          <div className="math-loading-banana"></div>
          <div className="math-loading-spinner"></div>
          <p>Loading Math Challenge...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="math-game-container">
      <div className="banana-bg"></div>
      
      <div className="math-header">
        <h1>Banana Math Challenge</h1>
        <p>Complete the math challenges to return to the banana game!</p>
      </div>
      
      <div className="math-iframe-container">
        {gameComplete && (
          <div className="game-result-overlay">
            <div className="game-result-card">
              <h2>{gameResult.passed ? "Great Job!" : "Try Again!"}</h2>
              <p>Your score: {gameResult.score}</p>
              {gameResult.passed ? (
                <p className="success-message">Redirecting to Banana Game...</p>
              ) : (
                <button 
                  className="retry-button"
                  onClick={handleRetry}
                >
                  Retry Challenge
                </button>
              )}
            </div>
          </div>
        )}
        
        <iframe
          src={`${mathGameApiUrl}?userId=${user.id}&token=${token}`}
          title="Math Game"
          className="math-game-iframe"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      
      <div className="math-footer">
        <button 
          className="back-button"
          onClick={() => navigate('/game')}
        >
          <span>Back to Banana Game</span>
          <div className="btn-banana-icon"></div>
        </button>
      </div>
      
      <div className="banana-decoration math-banana-1"></div>
      <div className="banana-decoration math-banana-2"></div>
      <div className="banana-decoration math-banana-3"></div>
    </div>
  );
};

export default MathGame;