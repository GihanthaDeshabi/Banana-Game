import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MathGame.css';

const MathGame = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [gameResult, setGameResult] = useState({ passed: false });
  const [mathProblem, setMathProblem] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [failedLevel, setFailedLevel] = useState(1);
  const navigate = useNavigate();
  
  const mathGameApiUrl = "https://marcconrad.com/uob/banana/api.php";

  useEffect(() => {
    const userFromStorage = localStorage.getItem('user');
    const tokenFromStorage = localStorage.getItem('token');
    const savedFailedLevel = localStorage.getItem('failedLevel');
    
    if (userFromStorage && tokenFromStorage) {
      setUser(JSON.parse(userFromStorage));
      setToken(tokenFromStorage);
      
      if (savedFailedLevel) {
        setFailedLevel(parseInt(savedFailedLevel, 10));
      }
      
      fetchMathProblem();
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchMathProblem = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(mathGameApiUrl);
      
      if (!response.ok) {
        throw new Error('Failed to fetch math problem');
      }
      
      const data = await response.json();
      setMathProblem(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching math problem:', error);
      setIsLoading(false);
    }
  };

  const handleAnswerSelection = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    const isCorrect = selectedAnswer === mathProblem.solution;
    
    setGameComplete(true);
    setGameResult({ passed: isCorrect });
    
    saveScore(isCorrect);
    
    setTimeout(() => {
      if (isCorrect) {
        localStorage.setItem('continueFromLevel', failedLevel.toString());
        
        navigate('/game');
      } else {
        localStorage.removeItem('continueFromLevel');
        navigate('/game');
      }
    }, 3000);
  };

  const saveScore = async (passed) => {
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
          score: passed ? 1 : 0,
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
        <p>Complete the math challenge to continue your game!</p>
      </div>
      
      <div className="math-iframe-container">
        {gameComplete && (
          <div className="game-result-overlay">
            <div className="game-result-card">
              <h2>{gameResult.passed ? "Great Job!" : "Try Again!"}</h2>
              {gameResult.passed ? (
                <p className="success-message">Returning to Level {failedLevel}...</p>
              ) : (
                <>
                  <p>The answer was incorrect.</p>
                  <p className="success-message">Returning to Level 1...</p>
                </>
              )}
            </div>
          </div>
        )}
        
        {mathProblem && !gameComplete && (
          <div className="math-problem-container">
            <div className="math-problem-image">
              <img 
                src={mathProblem.question} 
                alt="Math Problem" 
                className="problem-image"
              />
            </div>
            
            <div className="math-problem-options">
              <p>Select the correct answer:</p>
              <div className="answer-options">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((index) => (
                  <button
                    key={index}
                    className={`answer-button ${selectedAnswer === index ? 'selected' : ''}`}
                    onClick={() => handleAnswerSelection(index)}
                  >
                    {index}
                  </button>
                ))}
              </div>
              
              <button 
                className="submit-answer-button"
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
              >
                Submit Answer
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="banana-decoration math-banana-1"></div>
      <div className="banana-decoration math-banana-2"></div>
      <div className="banana-decoration math-banana-3"></div>
    </div>
  );
};

export default MathGame;