import React from "react";
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import '../../styles/Common/footer.css';
import logo from '../../static/images/frolics_logo_badge.svg';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      {/* Main Footer Content */}
      <div className="footer-content">
        {/* Logo Section */}
        <div className="footer-section footer-branding">
          <div className="footer-logo">
            <img src={logo} alt="Frolics logo" />
            <div className="logo-text-wrapper">
              <h3>FROLICS</h3>
              <p className="tagline">Celebrate Campus Life</p>
            </div>
          </div>
          <p className="footer-description">
            The ultimate platform for organizing, managing, and participating in college events. 
            Connect, collaborate, and celebrate with your campus community.
          </p>
        </div>

        {/* Quick Links Section */}
        <div className="footer-section footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/app/events">Events</Link></li>
            <li><Link to="/login">Sign In</Link></li>
            <li><Link to="/register">Register</Link></li>
          </ul>
        </div>

        {/* Contact Section */}
        <div className="footer-section footer-contact">
          <h4>Contact Us</h4>
          <ul className="contact-list">
            <li>
              <FaMapMarkerAlt className="contact-icon" aria-hidden="true" />
              <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer">
                Darshan University, Rajkot-Morbi Highway, 363650, Gujarat, India
              </a>
            </li>
            <li>
              <FaEnvelope className="contact-icon" aria-hidden="true" />
              <a href="mailto:frolics@darshan.ac.in">frolics@darshan.ac.in</a>
            </li>
            <li>
              <FaPhone className="contact-icon" aria-hidden="true" />
              <a href="tel:+919876543210">+91 9876543210</a>
            </li>
          </ul>
        </div>

        {/* Social Media Section */}
        <div className="footer-section footer-social">
          <h4>Follow Us</h4>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Facebook" className="social-icon">
              <FaFacebook />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Twitter" className="social-icon">
              <FaTwitter />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Instagram" className="social-icon">
              <FaInstagram />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="Follow us on LinkedIn" className="social-icon">
              <FaLinkedin />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="Subscribe on YouTube" className="social-icon">
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>&copy; {currentYear} Frolics. All rights reserved.</p>
          <div className="footer-legals">
            <Link to="/privacy">Privacy Policy</Link>
            <span className="separator">•</span>
            <Link to="/terms">Terms of Service</Link>
            <span className="separator">•</span>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;