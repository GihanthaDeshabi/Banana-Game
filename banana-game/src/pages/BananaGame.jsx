// src/pages/BananaGame.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Game.css'; // Reuse the same CSS

const BananaGame = () => {
  const navigate = useNavigate();

  return (
    <div className="game-container">
      <header className="game-header">
        <div className="header-content">
          <h1 className="game-title">🍌 Banana Math Challenge 🍌</h1>
          
          <div className="user-info">
            <div className="player-details">
              <span className="label">Player:</span> BananaFan
            </div>
            
            <button
              className="logout-btn"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="game-area" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h2 className="challenge-text">Coming Soon: Banana Math Challenge!</h2>
        <p style={{ marginBottom: '1rem', textAlign: 'center' }}>
          You've unlocked the Banana Math Challenge.
          <br />
          This part of the game is still in development.
        </p>
        <button
          onClick={() => navigate('/')}
          className="start-btn"
        >
          Back to Banana Tapper
        </button>
      </div>
    </div>
  );
};

export default BananaGame;