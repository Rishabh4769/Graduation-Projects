// components/user/Nav.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiZap, FiBarChart2, FiUsers, FiPlus, FiLink, FiCalendar, FiUser, FiFileText, FiLogOut } from 'react-icons/fi';
import '../../styles/Users/navbar.css';
import logo from '../../static/images/frolics_logo_badge.svg';
import { logoutAndRedirect } from '../../utils/auth';

const Nav = ({ userData }) => {
  // load persisted user (login stores `user` in localStorage)
  const [localUser, setLocalUser] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      if (raw) setLocalUser(JSON.parse(raw));
    } catch (e) { /* ignore */ }
  }, []);

  return (
    <>
    <header className="user-header">
      <nav className="user-navbar navbar navbar-expand-lg">
        <div className="container-fluid">
          {/* Logo */}
          <Link className="navbar-brand fw-bold fs-3" to="/app/dashboard">
            <img 
              src={logo} 
              alt="Frolics badge" 
              width="40" 
              height="40" 
              className="me-2 rounded-3"
            />
            FROLICS
          </Link>

          {/* Toggle button for mobile */}
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#userNavbarNav" 
            aria-controls="userNavbarNav" 
            aria-expanded="false" 
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navbar Links dynamically generated */}
          <div className="collapse navbar-collapse user-navbar-collapse" id="userNavbarNav">
            <ul className="navbar-nav ms-auto align-items-center">
              {/* Dashboard */}
              <li className="nav-item">
                <Link className="nav-link px-3 py-2 d-flex align-items-center gap-2" to="/app/dashboard">
                  <FiCalendar size={18} aria-hidden="true" />
                  <span>Dashboard</span>
                </Link>
              </li>

              {/* Events Dropdown */}
              <li className="nav-item dropdown">
                <button
                  className="nav-link px-3 py-2 dropdown-toggle d-flex align-items-center gap-2" 
                  type="button"
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                >
                  <FiCalendar size={18} aria-hidden="true" />
                  <span>Events</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end bg-white/90 backdrop-blur-xl border-white shadow-lg border rounded-3 mt-1">
                  <li><Link className="dropdown-item px-4 py-2 fw-medium d-flex align-items-center gap-2" to="/app/events"><FiCalendar size={16} aria-hidden="true" /> All Events</Link></li>
                  <li><Link className="dropdown-item px-4 py-2 fw-medium d-flex align-items-center gap-2" to="/app/events"><FiZap size={16} aria-hidden="true" /> Upcoming</Link></li>
                  <li><hr className="dropdown-divider mx-3 my-1 opacity-50"/></li>
                  <li><Link className="dropdown-item px-4 py-2 fw-medium text-danger d-flex align-items-center gap-2" to="/app/events"><FiBarChart2 size={16} aria-hidden="true" /> Past Events</Link></li>
                </ul>
              </li>

              {/* Groups Dropdown */}
              <li className="nav-item dropdown">
                <button 
                  className="nav-link px-3 py-2 dropdown-toggle d-flex align-items-center gap-2" 
                  type="button"
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                >
                  <FiUsers size={18} aria-hidden="true" />
                  <span>Groups</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end bg-white/90 backdrop-blur-xl border-white shadow-lg border rounded-3 mt-1">
                  <li><Link className="dropdown-item px-4 py-2 fw-medium d-flex align-items-center gap-2" to="/app/groups"><FiUsers size={16} aria-hidden="true" /> My Groups</Link></li>
                  <li><Link className="dropdown-item px-4 py-2 fw-medium d-flex align-items-center gap-2" to="/app/groups/create"><FiPlus size={16} aria-hidden="true" /> Create Group</Link></li>
                  <li><Link className="dropdown-item px-4 py-2 fw-medium d-flex align-items-center gap-2" to="/app/groups/join"><FiLink size={16} aria-hidden="true" /> Join Group</Link></li>
                </ul>
              </li>

              {/* Others Dropdown */}
              <li className="nav-item dropdown">
                <button 
                  className="nav-link px-3 py-2 dropdown-toggle d-flex align-items-center gap-2" 
                  type="button"
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                >
                  <FiFileText size={18} aria-hidden="true" />
                  <span>Others</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end bg-white/90 backdrop-blur-xl border-white shadow-lg border rounded-3 mt-1">
                  <li><Link className="dropdown-item px-4 py-2 fw-medium d-flex align-items-center gap-2" to="/app/others/rules"><FiFileText size={16} aria-hidden="true" /> Rules & Regulations</Link></li>
                  <li><Link className="dropdown-item px-4 py-2 fw-medium d-flex align-items-center gap-2" to="/app/others/hostel"><FiLink size={16} aria-hidden="true" /> Hostel Facilities</Link></li>
                </ul>
              </li>

              <li className="nav-item">
                <Link className="nav-link px-3 py-2 d-flex align-items-center gap-2" to="/app/others/winners">
                  <FiBarChart2 size={18} aria-hidden="true" />
                  <span>Winners</span>
                </Link>
              </li>

              {/* User Profile Dropdown */}
              <li className="nav-item dropdown">
                <button 
                  className="nav-link dropdown-toggle px-3 py-2 d-flex align-items-center gap-2" 
                  type="button"
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                  aria-label="User menu"
                >
                  <div 
                    className="avatar bg-gradient rounded-circle d-flex align-items-center justify-content-center text-white fw-bold fs-6" 
                    style={{ width: '32px', height: '32px' }}
                  >
                    <FiUser size={16} aria-hidden="true" />
                  </div>
                  <span className="d-none d-md-inline">{userData?.userName || userData?.name || localUser?.userName || localUser?.name || 'User'}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end bg-white/95 backdrop-blur-xl shadow-2xl border-white border rounded-3 mt-1 w-auto min-w-0">
                  <li className="px-4 py-3 border-bottom">
                    <div className="d-flex align-items-center gap-3">
                      <div 
                        className="avatar bg-gradient rounded-circle d-flex align-items-center justify-content-center text-white fw-bold fs-6" 
                        style={{ width: '40px', height: '40px' }}
                      >
                        <FiUser size={20} aria-hidden="true" />
                      </div>
                      <div>
                        <h6 className="mb-0 fw-semibold">{userData?.userName || 'User'}</h6>
                        <small className="text-muted">{userData?.email || 'user@example.com'}</small>
                      </div>
                    </div>
                  </li>
                  <li><Link className="dropdown-item px-4 py-3 fw-medium d-flex align-items-center gap-2" to="/app/profile"><FiUser size={16} aria-hidden="true" /> View Profile</Link></li>
                  <li><hr className="dropdown-divider mx-3 opacity-50"/></li>
                  <li>
                    <button
                      className="dropdown-item px-4 py-3 fw-medium d-flex align-items-center gap-2"
                      onClick={logoutAndRedirect}
                    >
                      <FiLogOut size={16} aria-hidden="true" /> Logout
                    </button>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
    </>
  );
};

export default Nav;
