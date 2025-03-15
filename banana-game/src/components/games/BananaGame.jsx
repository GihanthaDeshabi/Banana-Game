import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './BananaGame.css';

const BananaGame = () => {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [targetScore, setTargetScore] = useState(5);
  const [gameState, setGameState] = useState('idle'); 
  const [bananas, setBananas] = useState([]);
  const [splats, setSplats] = useState([]);
  const [user, setUser] = useState(null);
  const [showGameOverOptions, setShowGameOverOptions] = useState(false);
  const gameAreaRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userFromStorage = localStorage.getItem('user');
    if (userFromStorage) {
      setUser(JSON.parse(userFromStorage));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (timeLeft > 0 && gameState === 'playing') {
      const timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    } else if (timeLeft === 0 && gameState === 'playing') {
      checkLevelCompletion();
    }
  }, [timeLeft, gameState]);

  const checkLevelCompletion = () => {
    if (score >= targetScore) {
      setGameState('levelUp');
      
      setTimeout(() => {
        setLevel(prev => prev + 1);
        setTargetScore(prev => prev + 3); 
        setTimeLeft(20);
        setScore(0);
        setBananas([]);
        setGameState('playing');
      }, 3000);
    } else {
      endGame();
    }
  };

  useEffect(() => {
    if (gameState !== 'playing') return;

    const spawnBanana = () => {
      const gameArea = gameAreaRef.current;
      if (!gameArea) return;
      
      const maxWidth = gameArea.clientWidth - 80;
      const maxHeight = gameArea.clientHeight - 80;
    
      const maxBananas = 6 + Math.min(level - 1, 4);
      
      if (bananas.length < maxBananas) {
        const newBanana = {
          id: Date.now(),
          x: Math.random() * maxWidth,
          y: Math.random() * maxHeight,
          rotation: Math.random() * 360,
          scale: 0.8 + Math.random() * 0.4,
          speed: 1 + Math.random() * 2 + (level * 0.2), 
          wiggle: Math.random() > 0.5,
          wiggleAmount: 5 + Math.random() * 5
        };
        setBananas(prevBananas => [...prevBananas, newBanana]);
      }
    };

    const spawnInterval = setInterval(spawnBanana, Math.max(800 - (level * 50), 300));
    return () => clearInterval(spawnInterval);
  }, [bananas.length, gameState, level]);

  useEffect(() => {
    if (gameState !== 'playing') return;
    
    const gameArea = gameAreaRef.current;
    if (!gameArea) return;
    
    const maxHeight = gameArea.clientHeight;

    const moveInterval = setInterval(() => {
      setBananas(prevBananas => 
        prevBananas.map(banana => {
          let xOffset = 0;
          if (banana.wiggle) {
            xOffset = Math.sin(Date.now() / 300) * banana.wiggleAmount;
          }
          
          return {
            ...banana,
            y: banana.y + banana.speed,
            x: banana.x + xOffset,
            rotation: banana.rotation + 2
          };
        }).filter(banana => banana.y < maxHeight)
      );
    }, 30);

    return () => clearInterval(moveInterval);
  }, [gameState]);

  useEffect(() => {
    if (splats.length > 0) {
      const cleanupTimeout = setTimeout(() => {
        setSplats([]);
      }, 800);
      
      return () => clearTimeout(cleanupTimeout);
    }
  }, [splats]);

  const handleBananaTap = (id, x, y) => {
    setSplats(prev => [...prev, { id: Date.now(), x, y }]);
    
    setBananas(prevBananas => prevBananas.filter(banana => banana.id !== id));
    
    const gameArea = gameAreaRef.current;
    if (gameArea) {
      const scorePop = document.createElement('div');
      scorePop.className = 'score-pop';
      scorePop.textContent = '+1';
      scorePop.style.left = `${x}px`;
      scorePop.style.top = `${y}px`;
      gameArea.appendChild(scorePop);
      
      setTimeout(() => {
        if (gameArea.contains(scorePop)) {
          gameArea.removeChild(scorePop);
        }
      }, 1000);
    }
    
    setScore(prevScore => {
      const newScore = prevScore + 1;
      
      if (newScore >= targetScore && timeLeft > 0) {
        setGameState('levelUp');
        
        setTimeout(() => {
          setLevel(prev => prev + 1);
          setTargetScore(prev => prev + 3); 
          setTimeLeft(20);
          setScore(0);
          setBananas([]);
          setGameState('playing');
        }, 3000);
      }
      return newScore;
    });
  };

  const startGame = () => {
    setScore(0);
    setLevel(1);
    setTargetScore(5); 
    setTimeLeft(20);
    setBananas([]);
    setGameState('playing');
    setShowGameOverOptions(false);
  };

  const endGame = async () => {
    setGameState('ended');
    
    try {
      await saveScore(score, level - 1);
      setShowGameOverOptions(true);
    } catch (error) {
      console.error('Error saving score', error);
    }
  };

  const continueTtoMathGame = () => {
    navigate('/math-game');
  };

  const saveScore = async (finalScore, finalLevel) => {
    try {
      const token = localStorage.getItem('token');
      
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
          game: 'banana-tap',
          score: finalScore,
          level: finalLevel,
          won: false
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to save score');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error saving score:', error);
      throw error;
    }
  };

  const progressPercentage = Math.min((score / targetScore) * 100, 100);

  return (
    <div className="game-container">
      <header className="game-header-bar">
        <h1 className="game-title">🍌 Banana Tapper 🍌</h1>
        
        <div className="user-info">
          <div className="user-details">
            <span>Player: {user?.username || 'Player'}</span>
            <span>|</span>
            <span>High Score: {user?.highScore || 0}</span>
          </div>
          
          <button className="logout-btn">
            Logout
          </button>
        </div>
      </header>
      
      <div className="game-stats">
        <div className="level-display">
          Level {level}
        </div>
        
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
          <div className="progress-text">{score}/{targetScore}</div>
        </div>
        
        <div className="time-display">
          <div className="time-icon"></div>
          {timeLeft}s
        </div>
      </div>
      
      <div className="game-area" ref={gameAreaRef}>
        {gameState === 'idle' && (
          <div className="start-screen">
            <h2>Tap as many bananas as you can!</h2>
            <p>Level {level}: Get {targetScore} taps in {timeLeft} seconds</p>
            <p>Each level adds 3 more taps to the target</p>
            <button className="start-btn" onClick={startGame}>
              Start Game
            </button>
          </div>
        )}
        
        {gameState === 'playing' && (
          <>
            {bananas.map(banana => (
              <div 
                key={banana.id}
                className="banana"
                style={{
                  left: `${banana.x}px`,
                  top: `${banana.y}px`,
                  transform: `rotate(${banana.rotation}deg) scale(${banana.scale})`,
                }}
                onClick={(e) => {
                  e.preventDefault();
                  handleBananaTap(banana.id, banana.x, banana.y);
                }}
              />
            ))}
            
            {splats.map(splat => (
              <div 
                key={splat.id}
                className="banana-splat"
                style={{
                  left: `${splat.x}px`,
                  top: `${splat.y}px`,
                }}
              />
            ))}
          </>
        )}
        
        {gameState === 'levelUp' && (
          <div className="level-up-overlay">
            <div className="level-up-card">
              <h2>Level {level+1} Complete!</h2>
              <p>Great job! Get ready for level {level + 1}</p>
              <div className="next-target">Next target: {targetScore + 3} bananas</div>
            </div>
          </div>
        )}
        
        {gameState === 'ended' && showGameOverOptions && (
          <div className="game-over-overlay">
            <div className="game-over-card">
              <h2>Game Over!</h2>
              <p>Your score: {score}/{targetScore}</p>
              <p>Level reached: {level}</p>
              <p>What would you like to do next?</p>
              <div className="game-over-options">
                <button className="option-btn restart-btn" onClick={startGame}>
                  Start Again
                </button>
                <button className="option-btn continue-btn" onClick={continueTtoMathGame}>
                  Continue to Math Game
                </button>
              </div>
            </div>
          </div>
        )}
        
        {gameState === 'ended' && !showGameOverOptions && (
          <div className="game-over-overlay">
            <div className="game-over-card">
              <h2>Game Over!</h2>
              <p>Your score: {score}/{targetScore}</p>
              <p>Level reached: {level}</p>
              <p>Time to solve some math problems!</p>
              <div className="loading-spinner">
                <div className="banana-spin">🍌</div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="game-instructions">
        <h3>How to Play:</h3>
        <ul>
          <li>Tap the falling bananas to earn points</li>
          <li>Complete each level within the time limit</li>
          <li>Level 1: 5 bananas in 20 seconds</li>
          <li>Each level adds 3 more banana taps</li>
          <li>Missing your target means MATH time!</li>
        </ul>
      </div>
    </div>
  );
};

export default BananaGame;