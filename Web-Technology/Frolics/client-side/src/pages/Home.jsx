import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/home.css';
import logoBadge from '../static/images/frolics_logo_badge.svg';

const Home = () => {
  return (
    <div className="home-page">
      {/* Home-only navigation (from legacy index.ejs) */}
      <nav className="navbar" aria-label="Main navigation" role="navigation">
        <div className="nav-container">
          <Link to="/" className="logo" aria-label="Frolics home">
            <img src={logoBadge} alt="Frolics logo badge" className="logo-img" />
            <span className="logo-text">FROLICS</span>
          </Link>
          <div className="nav-actions">
            <Link to="/login" className="btn-login">Log In</Link>
            <Link to="/register" className="btn-signup">Sign Up</Link>
          </div>
        </div>
      </nav>
        {/* Main layout wrapper to match other pages */}
        <div className="main">
          <div className="container">
          {/* Hero Section */}
          <main className="hero-section" role="main">
            <div className="hero-content">
              <div className="badge">
                Darshan University
              </div>
              <h1 className="hero-title">
                ✨ Welcome to FROLICS ✨
                <span className="gradient-text">Celebrate Campus Life</span>
              </h1>
              <p className="hero-description">
                The ultimate platform for organizing, managing, and participating in events of Darshan University. 
                Technical & Non-Technical events, Fun all in one place.
              </p>
              <div className="hero-buttons">
                <Link to="/register" className="btn-primary" aria-label="Register for Frolics">
                  Get Registered Now
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
                <a href="#features" className="btn-secondary">Learn More</a>
              </div>
              <div className="stats">
                <div className="stat-item">
                  <div className="stat-number">500+</div>
                  <div className="stat-label">Events Hosted</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">10K+</div>
                  <div className="stat-label">Students Participated</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">50+</div>
                  <div className="stat-label">Colleges</div>
                </div>
              </div>
            </div>
          </main>
          </div>
        </div>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="features-container">
          <h2 className="section-title">Why Choose FROLICS?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon"></div>
              <h3>Easy Registration</h3>
              <p>Register for events in a few clicks with clear steps and confirmations.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"></div>
              <h3>Smart Scheduling</h3>
              <p>View event schedules, reminders and manage your calendar seamlessly.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"></div>
              <h3>Participant Management</h3>
              <p>Organizers can manage participants, attendance and team allocations easily.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"></div>
              <h3>Real-time Updates</h3>
              <p>Get live notifications for schedule changes, results and announcements.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"></div>
              <h3>Secure Payments</h3>
              <p>Integrated payment support for paid events with secure transaction handling.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"></div>
              <h3>Insights & Reports</h3>
              <p>Analytics for participation, popular events and organizer performance.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;