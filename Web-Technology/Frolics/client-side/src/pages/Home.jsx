import React from 'react';
import { Link } from 'react-router-dom';
import { FiUserPlus, FiCalendar, FiUsers, FiBell, FiShield, FiBarChart2 } from 'react-icons/fi';
import '../styles/home.css';
import '../styles/Users/partials/globals.css';
import '../styles/Users/partials/layout.css';
import logoBadge from '../static/images/frolics_logo_badge.svg';

const Home = () => {
  const features = [
    {
      title: 'Easy Registration',
      description: 'Join events in seconds with streamlined forms and instant confirmation.',
      icon: <FiUserPlus />,
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
    },
    {
      title: 'Smart Scheduling',
      description: 'Personalized timelines, reminders, and conflict-free scheduling for your events.',
      icon: <FiCalendar />,
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #c084fc 100%)',
    },
    {
      title: 'Team & Participant Management',
      description: 'Manage groups, leaders, and attendance in one place with real-time sync.',
      icon: <FiUsers />,
      gradient: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
    },
    {
      title: 'Live Updates',
      description: 'Instant notifications for schedule changes, room shifts, and results.',
      icon: <FiBell />,
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #fcd34d 100%)',
    },
    {
      title: 'Secure Payments',
      description: 'Trusted payments with receipts and status tracking for paid events.',
      icon: <FiShield />,
      gradient: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
    },
    {
      title: 'Insights & Reports',
      description: 'Dashboards for participation, leaderboards, and event performance.',
      icon: <FiBarChart2 />,
      gradient: 'linear-gradient(135deg, #6366f1 0%, #22d3ee 100%)',
    },
  ];

  return (
    <div className="home-page">
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
        <div className="main">
          <div className="container">
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

      <section className="features-section" id="features">
        <div className="features-container">
          <h2 className="section-title">Why Choose FROLICS?</h2>
          <div className="features-grid">
            {features.map((feature) => (
              <div className="feature-card" key={feature.title}>
                <div
                  className="feature-icon"
                  style={{ background: feature.gradient, color: '#ffffff' }}
                  aria-hidden="true"
                >
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
