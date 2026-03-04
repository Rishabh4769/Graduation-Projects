import React, { useState} from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiLock } from 'react-icons/fi';
import './../../styles/Auth/login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies if your API uses them
        body: JSON.stringify({ email, password, remember }),
      });

      const data = await response.json();

      if (response.ok) {
        const result = data || {};
        const token = result.token || null;
        const user = result.user || { email: email };

        // persist token + user for subsequent API calls
        if (token) localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        setSuccessMessage('Login successful! Redirecting to dashboard...');
        // Redirect into app shell
        setTimeout(() => {
          window.location.href = '/app';
        }, 800);
      } else {
        setErrorMessage(data.message || 'Invalid email or password. Please try again.');
      }
    } catch (error) {
      setErrorMessage('Network error. Please try again.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="background-decoration">
        <div className="bg-shape-1"></div>
        <div className="bg-shape-2"></div>
        <div className="diagonal-line"></div>
      </div>

      <nav>
        <Link to="#" className="logo">
          <div className="logo-circle">F</div>
          FROLICS
        </Link>
      </nav>

      <div className="container">
        <form className="form-section" id="loginForm" onSubmit={handleSubmit}>
          {successMessage && (
            <div className="success-message" id="successMessage">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="error-message" id="errorMessage">
              {errorMessage}
            </div>
          )}
          
              <div className="form-header">
            <h1>Welcome back</h1>
            <div className="login-link">
              Don't have an account? <Link to="/register">Sign Up</Link>
            </div>
          </div>

          {successMessage && <div className="success-message show">{successMessage}</div>}
          {errorMessage && <div className="error-message show">{errorMessage}</div>}

          <div className="form-group">
            <label htmlFor="email">
              Email <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text bg-transparent"><FiMail aria-hidden="true" /></span>
              <input
                type="email"
                id="email"
                name="email"
                className={`form-control ${errorMessage ? 'is-invalid' : ''}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@darshan.ac.in"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Password <span style={{ color: '#ef4444' }}>*</span>
              <button type="button" className="forgot-link ms-2" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </label>
            <div className="input-group">
              <span className="input-group-text bg-transparent"><FiLock aria-hidden="true" /></span>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                className={`form-control ${errorMessage ? 'is-invalid' : ''}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="remember"
              name="remember"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="remember">Remember me</label>
          </div>

          <div className="d-flex justify-content-between mb-3">
            <div></div>
            <a href="#forgot" className="forgot-link">Forgot password?</a>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            id="loginBtn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Logging in...
              </>
            ) : (
              'Log In'
            )}
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;
