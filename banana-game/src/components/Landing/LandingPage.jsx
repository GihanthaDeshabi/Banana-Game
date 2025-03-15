import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {

    setLoaded(true);

    const bananas = document.querySelectorAll('.banana-decoration');
    bananas.forEach((banana) => {
      banana.style.animationDelay = `${Math.random() * 2}s`;
    });
  }, []);

  return (
    <div className={`landing-container ${loaded ? 'loaded' : ''}`}>
      <div className="banana-bg"></div>

      <div className="content">
        <h1 className="title">
          {['B', 'A', 'N', 'A', 'N', 'A'].map((letter, index) => (
            <span 
              key={index} 
              className="banana-letter"
              style={{ animationDelay: `${0.1 + index * 0.1}s` }}
            >
              {letter}
            </span>
          ))}
          <span className="game-text">GAME</span>
        </h1>

        <p className="subtitle">Are you ready for a-peeling fun?</p>

        <div className="game-features">
          <div className="feature">
            <div className="feature-icon tap-icon"></div>
            <span>Tap Challenge</span>
          </div>
          <div className="feature">
            <div className="feature-icon math-icon"></div>
            <span>Math Puzzles</span>
          </div>
          <div className="feature">
            <div className="feature-icon level-icon"></div>
            <span>Progressive Levels</span>
          </div>
        </div>

        <div className="buttons">
          <Link to="/login" className="btn login-btn">
            <span>Login</span>
            <div className="btn-banana-icon"></div>
          </Link>
          <Link to="/register" className="btn register-btn">
            <span>Register</span>
            <div className="btn-banana-icon"></div>
          </Link>
        </div>
      </div>

      <div className="banana-decorations">
        <div className="banana-decoration banana-1"></div>
        <div className="banana-decoration banana-2"></div>
        <div className="banana-decoration banana-3"></div>
        <div className="banana-decoration banana-4"></div>
        <div className="banana-decoration banana-5"></div>
      </div>

      <div className="bottom-curve"></div>

      <footer className="landing-footer">
        <p>© 2025 Banana Game - All rights reserved</p>
        <div className="footer-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Support</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;