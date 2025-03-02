import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MathGame.css';

const MathGame = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();
  
  
  const mathGameApiUrl = "https://math-game-api.example.com/game";

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
        
        
        saveScore(score, passed);
        
        if (passed) {
          
          setTimeout(() => {
            navigate('/game');
          }, 3000);
        } else {
          
          // Allow retry
          // You could implement retry logic here
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [navigate, token, user]);

  const saveScore = async (score, passed) => {
    try {
      if (!token || !user) {
        throw new Error('Authentication required');
      }
      
      
      const response = await fetch('http://localhost:5000/api/scores', {
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

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading Math Game...</p>
      </div>
    );
  }

  return (
    <div className="math-game-container">
      <div className="game-header">
        <h1>Banana Math Challenge</h1>
        <p>Complete the math challenges to return to the banana game!</p>
      </div>
      
      <div className="iframe-container">
        <iframe
          src={`${mathGameApiUrl}?userId=${user.id}&token=${token}`}
          title="Math Game"
          className="math-game-iframe"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      
      <div className="game-footer">
        <button 
          className="back-button"
          onClick={() => navigate('/game')}
        >
          Back to Banana Game
        </button>
      </div>
    </div>
  );
};

export default MathGame;