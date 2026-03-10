import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiCheck, FiX, FiPhone } from 'react-icons/fi';
import axios from 'axios';
import '../../styles/Auth/signup.css';
import logoBadge from '../../static/images/frolics_logo_badge.svg';

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // FIX: Allow spaces in phone input, but validate digits only
    const cleanPhone = formData.phoneNumber.replace(/\s+/g, '');
    if (!cleanPhone) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\+?\d{7,15}$/.test(cleanPhone)) {
      newErrors.phoneNumber = 'Enter a valid phone number (7–15 digits, optional + prefix)';
    }

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.termsAccepted) {
      newErrors.termsAccepted = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      console.log("Validation Failed. Check console for errors.");
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // FIX: Ensure clean phone number is sent to backend
      const cleanPhone = formData.phoneNumber.replace(/\s+/g, '');

      const payload = {
        userName: `${formData.firstName} ${formData.lastName}`.trim(),
        emailAddress: formData.email,
        userPassword: formData.password,
        phoneNumber: cleanPhone, // Send clean number
      };

      const response = await axios.post('/register', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log("Response received:", response.data);
      setSuccess(true);

      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      let errorMessage = 'Registration failed. Please try again.';

      if (err.response) {
        // Server responded with a status other than 2xx
        const data = err.response.data;
        console.error("Backend Error Response:", data);
        if (typeof data === 'string') errorMessage = data;
        else if (data?.message) errorMessage = data.message;
        else if (data?.error) errorMessage = data.error;
        else if (Array.isArray(data?.errors)) errorMessage = data.errors.join(' • ');
        else errorMessage = `Server error (${err.response.status})`;
      } else if (err.request) {
        // Request made but no response
        console.error("No Response Received (Check CORS or Backend Running):", err.request);
        errorMessage = 'Cannot reach the server. Is the backend running?';
      } else {
        // Something else happened
        console.error("Error:", err.message);
        errorMessage = err.message || 'An unexpected error occurred';
      }

      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="signup-page">
        <div className="success-container">
          <div className="success-card">
            <FiCheck className="success-icon" aria-hidden="true" />
            <h2>Account Created Successfully!</h2>
            <p>Welcome to Frolics, {formData.firstName}!</p>
            <p className="redirect-text">Redirecting to login page...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-form-section">
          <Link to="/" className="signup-logo-link">
            <img src={logoBadge} alt="Frolics logo" className="signup-logo-img" />
            <span className="signup-logo-text">FROLICS</span>
          </Link>

          <div className="form-header">
            <h1 className="form-title">Create Account</h1>
            <p className="form-subtitle">Join thousands of students on Frolics</p>
          </div>

          {errors.submit && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              <FiX className="me-2" aria-hidden="true" />
              {errors.submit}
              <button
                type="button"
                className="btn-close"
                onClick={() => setErrors((prev) => ({ ...prev, submit: '' }))}
                aria-label="Close"
              ></button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="signup-form">
            <div className="row g-3">
              <div className="col-md-6">
                <label htmlFor="firstName" className="form-label">
                  First Name <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-transparent">
                    <FiUser aria-hidden="true" />
                  </span>
                  <input
                    type="text"
                    className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                    id="firstName"
                    name="firstName"
                    placeholder="Darshan"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
                {errors.firstName && (
                  <small className="text-danger d-block mt-1">{errors.firstName}</small>
                )}
              </div>

              <div className="col-md-6">
                <label htmlFor="lastName" className="form-label">
                  Last Name <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-transparent">
                    <FiUser aria-hidden="true" />
                  </span>
                  <input
                    type="text"
                    className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                    id="lastName"
                    name="lastName"
                    placeholder="University"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
                {errors.lastName && (
                  <small className="text-danger d-block mt-1">{errors.lastName}</small>
                )}
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email Address <span className="text-danger">*</span>
              </label>
              <div className="input-group">
                <span className="input-group-text bg-transparent">
                  <FiMail aria-hidden="true" />
                </span>
                <input
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  id="email"
                  name="email"
                  placeholder="your.email@darshan.ac.in"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              {errors.email && <small className="text-danger d-block mt-1">{errors.email}</small>}
            </div>

            <div className="mb-3">
              <label htmlFor="phoneNumber" className="form-label">
                Phone Number <span className="text-danger">*</span>
              </label>
              <div className="input-group">
                <span className="input-group-text bg-transparent">
                  <FiPhone aria-hidden="true" />
                </span>
                <input
                  type="tel"
                  className={`form-control ${errors.phoneNumber ? 'is-invalid' : ''}`}
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="+91 98765 43210"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              {errors.phoneNumber && (
                <small className="text-danger d-block mt-1">{errors.phoneNumber}</small>
              )}
              <small className="text-muted d-block mt-1">
                7–15 digits (spaces allowed for readability)
              </small>
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password <span className="text-danger">*</span>
              </label>
              <div className="input-group">
                <span className="input-group-text bg-transparent">
                  <FiLock aria-hidden="true" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                  disabled={loading}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && (
                <small className="text-danger d-block mt-1">{errors.password}</small>
              )}
              <small className="text-muted d-block mt-1">Must be at least 8 characters</small>
            </div>

            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password <span className="text-danger">*</span>
              </label>
              <div className="input-group">
                <span className="input-group-text bg-transparent">
                  <FiLock aria-hidden="true" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                  disabled={loading}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.confirmPassword && (
                <small className="text-danger d-block mt-1">{errors.confirmPassword}</small>
              )}
            </div>

            <div className="form-check mb-4">
              <input
                className={`form-check-input ${errors.termsAccepted ? 'is-invalid' : ''}`}
                type="checkbox"
                id="termsAccepted"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleChange}
                disabled={loading}
              />
              <label className="form-check-label" htmlFor="termsAccepted">
                I agree to the <Link to="/terms">Terms & Conditions</Link> and{' '}
                <Link to="/privacy">Privacy Policy</Link>
              </label>
              {errors.termsAccepted && (
                <small className="text-danger d-block mt-1">{errors.termsAccepted}</small>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 mb-3"
              disabled={loading}
              style={{ padding: '0.75rem', fontSize: '1rem', fontWeight: '600' }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>

            <div className="text-center">
              <p className="text-muted">
                Already have an account?{' '}
                <Link to="/login" className="text-primary fw-semibold">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
