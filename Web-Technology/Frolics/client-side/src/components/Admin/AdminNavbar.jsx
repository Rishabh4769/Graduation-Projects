import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiHome, FiCalendar, FiUsers, FiFileText, FiBarChart2, FiSettings, FiLogOut } from 'react-icons/fi';
import '../../styles/Common/navbar.modern.css';
import logo from '../../static/images/frolics_logo_badge.svg';

const AdminNavbar = ({ userData }) => {
  const [collapsed, setCollapsed] = useState(true);

  const toggleCollapse = () => setCollapsed(!collapsed);

  return (
    <header className="user-header">
      <nav className="user-navbar navbar navbar-expand-lg">
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold fs-3" to="/app/admin/dashboard">
            <img src={logo} alt="Frolics badge" width="40" height="40" className="me-2 rounded-3" />
            FROLICS Admin
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleCollapse}
            aria-controls="adminNavbarNav"
            aria-expanded={!collapsed}
            aria-label="Toggle navigation"
          >
            <FiMenu />
          </button>

          <div className={`collapse navbar-collapse user-navbar-collapse ${collapsed ? '' : 'show'}`} id="adminNavbarNav">
            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item">
                <Link className="nav-link" to="/app/admin/dashboard">Dashboard</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/app/admin/events">Events</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/app/admin/users">Users</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/app/admin/registrations">Registrations</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/app/admin/analytics">Analytics</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/app/admin/reports">Reports</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/app/admin/settings">Settings</Link>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link btn btn-link"
                  onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); window.location.href = '/login'; }}
                >
                  <FiLogOut /> Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default AdminNavbar;
