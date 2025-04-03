import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './BananaGame.css';

const BananaGame = () => {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [targetScore, setTargetScore] = useState(0);
  const [gameState, setGameState] = useState('idle'); 
  const [bananas, setBananas] = useState([]);
  const [splats, setSplats] = useState([]);
  const [user, setUser] = useState(null);
  const [highestScore, setHighestScore] = useState(0);
  const [highestLevel, setHighestLevel] = useState(0);
  const [showGameOverOptions, setShowGameOverOptions] = useState(false);
  const gameAreaRef = useRef(null);
  const navigate = useNavigate();

  const getTargetForLevel = (levelNum) => {
    return levelNum * 3;
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userFromStorage = localStorage.getItem('user');
    
    if (!token) {
      console.log('No authentication token found, redirecting to login');
      navigate('/login');
      return;
    }
    
    if (userFromStorage) {
      setUser(JSON.parse(userFromStorage));
      
      fetchHighestScore(token);
      
      const continueFromLevel = localStorage.getItem('continueFromLevel');
      if (continueFromLevel) {
        const levelToRestore = parseInt(continueFromLevel, 10);
        localStorage.removeItem('continueFromLevel');
        
        setScore(0);
        setLevel(levelToRestore);
        setTargetScore(getTargetForLevel(levelToRestore));
        setTimeLeft(getTimeForLevel(levelToRestore));
        setBananas([]);
        setGameState('playing');
      }
    } else {
      console.log('No user data found, redirecting to login');
      navigate('/login');
    }
  }, [navigate]);

  const fetchHighestScore = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/api/scores?game=banana-tap', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const scores = await response.json();
        
        if (scores && scores.length > 0) {
          let maxScore = 0;
          let maxLevel = 0;
          
          scores.forEach(scoreItem => {
            if (scoreItem.score > maxScore) {
              maxScore = scoreItem.score;
            }
            if (scoreItem.level > maxLevel) {
              maxLevel = scoreItem.level;
            }
          });
          
          setHighestScore(maxScore);
          setHighestLevel(maxLevel);
        }
      } else {
        console.warn('Failed to fetch highest score');
      }
    } catch (error) {
      console.error('Error fetching highest score:', error);
    }
  };

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
  
  const getTimeForLevel = (levelNum) => {
    return 20 + ((levelNum - 1) * 5);
  };

  const checkLevelCompletion = () => {
    if (score >= targetScore) {
      setGameState('levelUp');
      
      setTimeout(() => {
        const nextLevel = level + 1;
        setLevel(nextLevel);
        
        const nextTarget = getTargetForLevel(nextLevel);
        setTargetScore(nextTarget);
        
        setTimeLeft(getTimeForLevel(nextLevel));
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
    
      const maxBananas = 7 + Math.min(level, 5);
      
      if (bananas.length < maxBananas) {
        const newBanana = {
          id: Date.now(),
          x: Math.random() * maxWidth,
          y: Math.random() * maxHeight,
          rotation: Math.random() * 360,
          scale: 0.8 + Math.random() * 0.4,
          speed: 0.7 + Math.random() * 1.5 + (level * 0.15), 
          wiggle: Math.random() > 0.5,
          wiggleAmount: 5 + Math.random() * 5
        };
        setBananas(prevBananas => [...prevBananas, newBanana]);
      }
    };

    const spawnInterval = setInterval(spawnBanana, Math.max(1000 - (level * 40), 400));
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
      
    
      if (newScore >= targetScore && timeLeft > 0 && gameState === 'playing') {
        setGameState('levelUp');
        
        setTimeout(() => {
          const nextLevel = level + 1;
          setLevel(nextLevel);
          
          
          const nextTarget = getTargetForLevel(nextLevel);
          setTargetScore(nextTarget);
          
          setTimeLeft(getTimeForLevel(nextLevel));
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
    setTargetScore(getTargetForLevel(1)); 
    setTimeLeft(getTimeForLevel(1));
    setBananas([]);
    setGameState('playing');
    setShowGameOverOptions(false);
  };

  const endGame = async () => {
    setGameState('ended');
    
    const totalPoints = calculateTotalPoints();
    
    localStorage.setItem('failedLevel', level.toString());
    
    
    const saveResult = await saveScore(totalPoints, level);
    
    if (!saveResult.success && saveResult.message === 'Session expired') {
      console.warn('Session expired while saving score');
    }
    
    setShowGameOverOptions(true);
  };

  const calculateTotalPoints = () => {
    let totalPoints = score;
    
    
    for (let i = 1; i < level; i++) {
      totalPoints += getTargetForLevel(i);
    }
    
    return totalPoints;
  };

  const continueToMathGame = () => {
    navigate('/math-game');
  };

  const saveScore = async (finalScore, finalLevel) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token || !user) {
        console.warn('Authentication missing, continuing without saving score');
        return { success: false, message: 'Authentication required' };
      }
      
      try {
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
          
          if (response.status === 401) {
            console.warn('Token expired, attempting to refresh or redirecting user');
            
            localStorage.removeItem('token'); 
            return { success: false, message: 'Session expired' };
          }
          
          console.warn('Failed to save score, but continuing game flow');
          return { success: false, message: 'Failed to save score' };
        }
        
       
        if (finalScore > highestScore) {
          setHighestScore(finalScore);
        }
        
       
        if (finalLevel > highestLevel) {
          setHighestLevel(finalLevel);
        }
        
        return { success: true, data: await response.json() };
      } catch (networkError) {
        console.warn('Network error when saving score, continuing game flow', networkError);
        return { success: false, message: 'Network error' };
      }
    } catch (error) {
      console.error('Error in saveScore function:', error);
      return { success: false, message: 'Error saving score' };
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
            <span>High Score: {highestScore}</span>
            {/* <span>|</span>
            <span>Highest Level: {highestLevel}</span> */}
          </div>
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
            <p>Level 1: Get 3 taps in 20 seconds</p>
            <p>Level 2: Get 6 taps in 25 seconds</p>
            <p>Each level adds 3 more banana taps and 5 more seconds</p>
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
              <h2>Level {level} Complete!</h2>
              <p>Great job! Get ready for level {level + 1}</p>
              <div className="next-target">Next target: {getTargetForLevel(level + 1)} bananas</div>
            </div>
          </div>
        )}
        
        {gameState === 'ended' && showGameOverOptions && (
          <div className="game-over-overlay">
            <div className="game-over-card">
              <h2>Game Over!</h2>
              <p>Your score: {score}/{targetScore}</p>
              <p>Level reached: {level}</p>
              <p>Total points: {calculateTotalPoints()}</p>
              <p>What would you like to do next?</p>
              <div className="game-over-options">
                <button className="option-btn restart-btn" onClick={startGame}>
                  <span className="btn-text">Start Again</span>
                </button>
                <button className="option-btn continue-btn" onClick={continueToMathGame}>
                  <span className="btn-text">Play mathgame for extra life</span>
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
              <p>Total points: {calculateTotalPoints()}</p>
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
          <li>Level 1: 3 bananas in 20 seconds</li>
          <li>Level 2: 6 bananas in 25 seconds</li>
          <li>Each level adds 3 more banana taps and gives you more time</li>
          <li>If you fail, try the math challenge for an extra life!</li>
        </ul>
      </div>
    </div>
  );
};

export default BananaGame;