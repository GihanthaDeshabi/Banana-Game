import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const [loaded, setLoaded] = useState(false);
  const contentRef = useRef(null);
  const bananaRefs = useRef([]);

  useEffect(() => {
    setLoaded(true);

    bananaRefs.current.forEach((banana) => {
      if (banana) {
        banana.style.animationDelay = `${Math.random() * 2}s`;
      }
    });

    const content = contentRef.current;
    const handleMouseMove = (e) => {
      if (!content) return;
      
      const rect = content.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const moveX = (e.clientX - centerX) / 50;
      const moveY = (e.clientY - centerY) / 50;
      
      content.style.transform = `perspective(1000px) rotateX(${-moveY * 0.5}deg) rotateY(${moveX * 0.5}deg)`;
      
      bananaRefs.current.forEach((banana, index) => {
        if (banana) {
          const factor = (index % 2 === 0) ? 1 : -1;
          banana.style.transform = `translate(${moveX * factor * 2}px, ${moveY * factor * 2}px) rotate(${banana.dataset.rotate}deg)`;
        }
      });
    };

    const handleMouseLeave = () => {
      if (!content) return;
      content.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
      
      bananaRefs.current.forEach((banana) => {
        if (banana) {
          banana.style.transform = `rotate(${banana.dataset.rotate}deg)`;
        }
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    content.addEventListener('mouseleave', handleMouseLeave);

    const features = document.querySelectorAll('.feature');
    features.forEach((feature, index) => {
      feature.style.animationDelay = `${1.3 + index * 0.2}s`;
    });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (content) {
        content.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  const bananaRotations = ['-15', '25', '45', '-30', '15'];

  return (
    <div className={`landing-container ${loaded ? 'loaded' : ''}`}>
      <div className="banana-bg"></div>

      <div className="content" ref={contentRef}>
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
            <span className="feature-text">Tap Challenge</span>
          </div>
          <div className="feature">
            <div className="feature-icon math-icon"></div>
            <span className="feature-text">Math Puzzles</span>
          </div>
          <div className="feature">
            <div className="feature-icon level-icon"></div>
            <span className="feature-text">Progressive Levels</span>
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
        {bananaRotations.map((rotation, index) => (
          <div
            key={index}
            ref={(el) => (bananaRefs.current[index] = el)}
            data-rotate={rotation}
            className={`banana-decoration banana-${index + 1}`}
            style={{ animationDelay: `${Math.random() * 2}s` }}
          ></div>
        ))}
      </div>

      <div className="particles-container">
        {[...Array(15)].map((_, index) => (
          <div
            key={index}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`
            }}
          ></div>
        ))}
      </div>

      <div className="bottom-curve"></div>

      <footer className="landing-footer">
        <p></p>
        <div className="footer-links">
          <a href="#" className="footer-link">Privacy</a>
          <a href="#" className="footer-link">Terms</a>
          <a href="#" className="footer-link">Support</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;