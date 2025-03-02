import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <div className="footer-banana-icon"></div>
          <span>Banana Game</span>
        </div>
        
        <div className="footer-info">
          <p>&copy; {currentYear} Banana Game. University Assessment Project.</p>
          <p>All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;