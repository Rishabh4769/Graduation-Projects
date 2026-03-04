import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiCheck, FiX } from 'react-icons/fi';
import { fetchJson } from '../../utils/api';
import '../../styles/Auth/signup.css';
import logoBadge from '../../static/images/frolics_logo_badge.svg';

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
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
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // server expects user fields under /api/users
      const payload = {
        userName: `${formData.firstName} ${formData.lastName}`.trim(),
        emailAddress: formData.email,
        userPassword: formData.password
      };

      try {
        await fetchJson('/users', { method: 'POST', body: JSON.stringify(payload) });
        setSuccess(true);
        setTimeout(() => {
          window.location.href = '/login';
        }, 1200);
      } catch (err) {
        setErrors({ submit: err.data?.message || err.message || 'Registration failed. Please try again.' });
      }
    } catch (error) {
      setErrors({ submit: 'An error occurred. Please try again.' });
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
        {/* Left Section - Form */}
        <div className="signup-form-section">
          {/* Logo */}
          <Link to="/" className="signup-logo-link">
            <img src={logoBadge} alt="Frolics logo" className="signup-logo-img" />
            <span className="signup-logo-text">FROLICS</span>
          </Link>

          {/* Form Header */}
          <div className="form-header">
            <h1 className="form-title">Create Account</h1>
            <p className="form-subtitle">Join thousands of students on Frolics</p>
          </div>

          {/* Error Alert */}
          {errors.submit && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              <FiX className="me-2" aria-hidden="true" />
              {errors.submit}
              <button type="button" className="btn-close" onClick={() => setErrors({ ...errors, submit: '' })}></button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="signup-form">
            {/* Name Row */}
            <div className="row g-3">
              <div className="col-md-6">
                <label htmlFor="firstName" className="form-label">
                  First Name
                  <span className="text-danger">*</span>
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
                  />
                </div>
                {errors.firstName && <small className="text-danger d-block mt-1">{errors.firstName}</small>}
              </div>

              <div className="col-md-6">
                <label htmlFor="lastName" className="form-label">
                  Last Name
                  <span className="text-danger">*</span>
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
                  />
                </div>
                {errors.lastName && <small className="text-danger d-block mt-1">{errors.lastName}</small>}
              </div>
            </div>

            {/* Email */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email Address
                <span className="text-danger">*</span>
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
                />
              </div>
              {errors.email && <small className="text-danger d-block mt-1">{errors.email}</small>}
            </div>

            {/* Password */}
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
                <span className="text-danger">*</span>
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
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && <small className="text-danger d-block mt-1">{errors.password}</small>}
              <small className="text-muted d-block mt-1">Must be at least 8 characters</small>
            </div>

            {/* Confirm Password */}
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
                <span className="text-danger">*</span>
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
                />
              </div>
              {errors.confirmPassword && <small className="text-danger d-block mt-1">{errors.confirmPassword}</small>}
            </div>

            {/* Terms Checkbox */}
            <div className="form-check mb-4">
              <input
                className={`form-check-input ${errors.termsAccepted ? 'is-invalid' : ''}`}
                type="checkbox"
                id="termsAccepted"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="termsAccepted">
                I agree to the <Link to="/terms">Terms & Conditions</Link> and <Link to="/privacy">Privacy Policy</Link>
              </label>
              {errors.termsAccepted && <small className="text-danger d-block mt-1">{errors.termsAccepted}</small>}
            </div>

            {/* Submit Button */}
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

            {/* Login Link */}
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
