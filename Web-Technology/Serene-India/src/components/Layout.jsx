import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import siteLogo from '../../static/images/site.png';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/destinations', label: 'Destinations' },
  { to: '/places', label: 'Places' },
  { to: '/cuisines', label: 'Cuisines' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
];

function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="app-shell d-flex flex-column min-vh-100">
      <header className={`header${scrolled ? ' scrolled' : ''}`} id="header">
        <div className="container d-flex flex-wrap align-items-center justify-content-between py-2">
          <div className="brand d-flex align-items-center gap-3">
            <img src={siteLogo} alt="Serene Indian Journeys logo" className="brand-logo" />
            <div className="brand-text">
              <h1 className="site-title">Serene Indian Journeys</h1>
              <p className="tagline">Experience India&apos;s beauty</p>
            </div>
          </div>

          <nav className="nav d-flex align-items-center gap-3">
            <button
              className={`hamburger${menuOpen ? ' active' : ''}`}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              aria-controls="navMenu"
              onClick={() => setMenuOpen((open) => !open)}
              type="button"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>

            <ul className={`nav-menu list-unstyled m-0 gap-3${menuOpen ? ' active' : ''}`} id="navMenu">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <Outlet />

      <footer className="footer text-center py-3 mt-auto">
        <div className="container">
          <div className="footer-content">
            <p className="copyright">&copy; 2026 Serene Indian Journeys. All rights reserved.</p>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-link">
                Facebook
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-link">
                Twitter
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-link">
                Instagram
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="social-link">
                YouTube
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
