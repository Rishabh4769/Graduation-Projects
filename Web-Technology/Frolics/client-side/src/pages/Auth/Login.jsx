import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiLock } from 'react-icons/fi';
import axios from 'axios';
import './../../styles/Auth/login.css';
import logoBadge from '../../static/images/frolics_logo_badge.svg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [remember, setRemember] = useState(false);
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
      const response = await axios.post(
        '/api/login',
        { email, password},
        { withCredentials: true }
      );

      const result = response.data || {};
      const token = result.token || null;
      const user = result.user || { email: email };

      if (token) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        setSuccessMessage('Login successful! Redirecting to dashboard...');
        setTimeout(() => {
          window.location.href = '/app';
        }, 800);
      } else {
        setErrorMessage(result.message || 'Invalid email or password. Please try again.');
      }
    } catch (error) {
      setErrorMessage('Network error. Please try again.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page auth-page">
      <div className="auth-background-decoration">
        <div className="bg-shape-1"></div>
        <div className="bg-shape-2"></div>
        <div className="diagonal-line"></div>
      </div>

      <div className="login-container">
        <div className="login-form-section">
          <Link to="/" className="auth-logo-link">
            <img src={logoBadge} alt="Frolics logo" className="auth-logo-img" />
            <span className="auth-logo-text">FROLICS</span>
          </Link>

          <div className="auth-form-header">
            <h1 className="auth-form-title">Welcome back</h1>
            <p className="auth-form-subtitle">
              Log in to manage events, groups and your Frolics profile.
            </p>
          </div>

          {successMessage && <div className="success-message show">{successMessage}</div>}
          {errorMessage && <div className="error-message show">{errorMessage}</div>}

          <form className="auth-form" id="loginForm" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div className="input-group">
                <span className="input-group-text bg-transparent">
                  <FiMail aria-hidden="true" />
                </span>
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
              <label
                htmlFor="password"
                className="form-label d-flex justify-content-between align-items-center"
              >
                <span>
                  Password <span style={{ color: '#ef4444' }}>*</span>
                </span>
                <button
                  type="button"
                  className="forgot-link toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </label>
              <div className="input-group">
                <span className="input-group-text bg-transparent">
                  <FiLock aria-hidden="true" />
                </span>
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

            {/* <div className="auth-form-meta">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="remember"
                  name="remember"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="remember">
                  Remember me
                </label>
              </div>
              <button type="button" className="forgot-link">
                Forgot password?
              </button>
            </div> */}

            <button
              type="submit"
              className="btn btn-primary w-100"
              id="loginBtn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Logging in...
                </>
              ) : (
                'Log In'
              )}
            </button>

            <div className="auth-footer-text">
              <span>Don&apos;t have an account?</span>{' '}
              <Link to="/register" className="text-primary fw-semibold">
                Sign Up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
