import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    
    if (location.state?.message) {
      setSuccess(location.state.message);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      
      navigate('/game');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="banana-bg"></div>
      
      <div className="login-card">
        <div className="login-header">
          <h2>Welcome Back!</h2>
          <div className="banana-icon"></div>
        </div>
        
        {error && (
          <div className="error-message">
            <span className="error-icon">!</span>
            {error}
          </div>
        )}
        
        {success && (
          <div className="success-message">
            <span className="success-icon">✓</span>
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="login-form">
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
                placeholder="Enter your password"
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
          </div>
          
          <div className="form-options">
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <Link to="/forgot-password" className="forgot-password">Forgot Password?</Link>
          </div>
          
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (
              <>
                <div className="spinner"></div>
                <span>Logging in...</span>
              </>
            ) : (
              <>
                <span>Login</span>
                <div className="btn-icon"></div>
              </>
            )}
          </button>
        </form>
        
        <div className="divider">
          <span>OR</span>
        </div>
        
        <button className="google-login">
          <div className="google-icon"></div>
          <span>Continue with Google</span>
        </button>
        
        <div className="login-footer">
          <p>Don't have an account? <Link to="/register" className="register-link">Register here</Link></p>
          <Link to="/" className="home-link">Back to Home</Link>
        </div>
      </div>
      
      <div className="banana-decoration banana-1"></div>
      <div className="banana-decoration banana-2"></div>
      <div className="banana-decoration banana-3"></div>
    </div>
  );
};

export default Login;