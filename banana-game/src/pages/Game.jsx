// src/pages/Game.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Game.css'; // Make sure to create this file

const Game = () => {
  const navigate = useNavigate();
  
  // Game settings
  const GAME_DURATION = 20;
  const TARGET_TAPS = 25;
  
  // Game states
  const [gameState, setGameState] = useState('idle');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [bananaPosition, setBananaPosition] = useState({ top: 150, left: 200 });
  const [message, setMessage] = useState('');
  const [showAnimation, setShowAnimation] = useState(false);
  const [gameResult, setGameResult] = useState('');
  
  // Mock user data - replace with actual user data if needed
  const [user] = useState({ username: 'BananaFan', highScore: 32 });
  
  // Refs
  const timerRef = useRef(null);
  const gameAreaRef = useRef(null);
  
  // Timer effect
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  // Start game
  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setGameResult('');
    
    // Start timer
    timerRef.current = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current);
          endGame();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    // Set initial banana position
    moveBanana();
  };
  
  // End game
  const endGame = () => {
    setGameState('ended');
    clearInterval(timerRef.current);
    
    // Determine if player met the challenge
    if (score >= TARGET_TAPS) {
      setMessage(`Success! You got ${score} taps! 🎉`);
      setGameResult('success');
      
      // Navigate to banana math game after a delay
      setTimeout(() => {
        navigate('/banana-game');
      }, 3000);
    } else {
      setMessage(`Try again! You got ${score}/${TARGET_TAPS} taps needed.`);
      setGameResult('fail');
    }
  };
  
  // Handle banana tap/click
  const handleBananaTap = () => {
    if (gameState !== 'playing') return;
    
    // Show tap animation
    setShowAnimation(true);
    setTimeout(() => setShowAnimation(false), 150);
    
    // Increase score
    setScore(prevScore => prevScore + 1);
    
    // Move banana to a new position
    moveBanana();
  };
  
  // Move banana to a random position
  const moveBanana = () => {
    if (!gameAreaRef.current) return;
    
    const gameArea = gameAreaRef.current.getBoundingClientRect();
    const bananaSize = 80;
    
    // Calculate maximum positions
    const maxTop = gameArea.height - bananaSize;
    const maxLeft = gameArea.width - bananaSize;
    
    // Set new random position
    setBananaPosition({
      top: Math.floor(Math.random() * maxTop),
      left: Math.floor(Math.random() * maxLeft)
    });
  };
  
  // Progress bar calculation
  const progressPercentage = (score / TARGET_TAPS) * 100;
  
  return (
    <div className="game-container">
      {/* Header */}
      <header className="game-header">
        <div className="header-content">
          <h1 className="game-title">🍌 Banana Tapper 🍌</h1>
          
          <div className="user-info">
            <div className="player-details">
              <span className="label">Player:</span> {user.username} | 
              <span className="label"> High Score:</span> {user.highScore}
            </div>
            
            <button className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>
      
      {/* Game Info */}
      <div className="game-info">
        <div className="stats-container">
          <div className="stat-box">
            <p className="stat-label">Time Left</p>
            <p className="stat-value">{timeLeft}s</p>
          </div>
          
          <div className="stat-box">
            <p className="stat-label">Score</p>
            <p className="stat-value">{score}/{TARGET_TAPS}</p>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="progress-container">
          <div 
            className="progress-bar"
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          ></div>
        </div>
      </div>
      
      {/* Game Area */}
      <div 
        ref={gameAreaRef}
        className="game-area"
      >
        {gameState === 'idle' && (
          <div className="start-screen">
            <h2 className="challenge-text">Can you tap {TARGET_TAPS} bananas in {GAME_DURATION} seconds?</h2>
            <button
              onClick={startGame}
              className="start-btn"
            >
              Start Challenge
            </button>
          </div>
        )}
        
        {gameState === 'playing' && (
          <div 
            className={`banana ${showAnimation ? 'tap-animation' : ''}`}
            style={{ 
              top: `${bananaPosition.top}px`, 
              left: `${bananaPosition.left}px`
            }}
            onClick={handleBananaTap}
          >
            <div className="banana-emoji">
              🍌
            </div>
            
            {showAnimation && (
              <div className="tap-effect">
                <div className="ripple"></div>
              </div>
            )}
          </div>
        )}
        
        {gameState === 'ended' && (
          <div className="end-screen">
            <h2 className={`result-message ${gameResult === 'success' ? 'success' : 'fail'}`}>
              {message}
            </h2>
            
            {gameResult === 'success' ? (
              <div className="success-animation">
                <div className="banana-row">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="bouncing-banana" style={{ animationDelay: `${i * 0.1}s` }}>
                      🍌
                    </div>
                  ))}
                </div>
                <p className="redirect-text">Get ready for Banana Math Challenge!</p>
                <div className="loading-banana">
                  <div className="spinning-banana">
                    🍌
                  </div>
                </div>
              </div>
            ) : (
              <div className="fail-animation">
                <div className="sad-banana">
                  🍌
                </div>
                <button
                  onClick={startGame}
                  className="try-again-btn"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Instructions */}
      <div className="instructions">
        <h3 className="instructions-title">How to Play:</h3>
        <ul className="instructions-list">
          <li>Click the 'Start Challenge' button to begin</li>
          <li>Tap/Click on the bananas as quickly as possible</li>
          <li>Goal: Tap at least {TARGET_TAPS} bananas in {GAME_DURATION} seconds</li>
          <li>Each tap earns you 1 point</li>
          <li>Success unlocks the Banana Math Challenge!</li>
        </ul>
      </div>
    </div>
  );
};

export default Game;