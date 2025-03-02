import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    
    if (name === 'password') {
      const strength = calculatePasswordStrength(value);
      setPasswordStrength(strength);
    }
  };

  const calculatePasswordStrength = (password) => {
    if (!password) return 0;
    
    let strength = 0;
    
  
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
   
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    return Math.min(strength, 5);
  };

  const getStrengthText = () => {
    const texts = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    return texts[passwordStrength];
  };

  const getStrengthColor = () => {
    const colors = ['#FF3860', '#FF3860', '#FFCD38', '#FFCD38', '#00C896', '#00C896'];
    return colors[passwordStrength];
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

  
      navigate('/login', { state: { message: 'Registration successful! Please login.' } });
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="banana-bg"></div>
      
      <div className="register-card">
        <div className="register-header">
          <h2>Join the Banana Fun!</h2>
          <div className="banana-icon"></div>
        </div>
        
        {error && (
          <div className="error-message">
            <span className="error-icon">!</span>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className="input-wrapper">
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Choose a username"
              />
              <div className="input-icon user-icon"></div>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
              />
              <div className="input-icon email-icon"></div>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
                placeholder="Create a password"
              />
              <div className="input-icon password-icon"></div>
              <button 
                type="button" 
                className="password-toggle"
                onClick={togglePassword}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            
            {formData.password && (
              <div className="password-strength">
                <div className="strength-meter">
                  {[1, 2, 3, 4, 5].map(index => (
                    <div 
                      key={index}
                      className={`strength-segment ${index <= passwordStrength ? 'active' : ''}`}
                      style={{ backgroundColor: index <= passwordStrength ? getStrengthColor() : '' }}
                    ></div>
                  ))}
                </div>
                <span className="strength-text" style={{ color: getStrengthColor() }}>
                  {getStrengthText()}
                </span>
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength="6"
                placeholder="Confirm your password"
              />
              <div className="input-icon password-icon"></div>
            </div>
          </div>
          
          <div className="terms-agreement">
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms">
              I agree to the <Link to="/terms" className="terms-link">Terms of Service</Link> and <Link to="/privacy" className="terms-link">Privacy Policy</Link>
            </label>
          </div>
          
          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? (
              <>
                <div className="spinner"></div>
                <span>Creating account...</span>
              </>
            ) : (
              <>
                <span>Register</span>
                <div className="btn-icon"></div>
              </>
            )}
          </button>
        </form>
        
        <div className="divider">
          <span>OR</span>
        </div>
        
        <button className="google-register">
          <div className="google-icon"></div>
          <span>Continue with Google</span>
        </button>
        
        <div className="register-footer">
          <p>Already have an account? <Link to="/login" className="login-link">Login here</Link></p>
          <Link to="/" className="home-link">Back to Home</Link>
        </div>
      </div>
      
      <div className="banana-decoration banana-1"></div>
      <div className="banana-decoration banana-2"></div>
      <div className="banana-decoration banana-3"></div>
    </div>
  );
};

export default Register;