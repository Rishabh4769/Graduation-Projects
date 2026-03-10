import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiAward,
  FiCalendar,
  FiClipboard,
  FiFileText,
  FiHome,
  FiLogOut,
  FiPlus,
  FiUser,
  FiUsers,
} from 'react-icons/fi';
import '../../styles/Users/navbar.css';
import logo from '../../static/images/frolics_logo_badge.svg';
import { logoutAndRedirect } from '../../utils/auth';

const AdminNavbar = ({ userData }) => {
  const [localUser, setLocalUser] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      if (raw) {
        setLocalUser(JSON.parse(raw));
      }
    } catch (error) {
      // ignore malformed local storage
    }
  }, []);

  const displayName = userData?.userName || userData?.name || localUser?.userName || localUser?.name || 'Admin';
  const displayEmail = userData?.email || localUser?.email || 'admin@example.com';

  return (
    <>
      <header className="user-header">
        <nav className="user-navbar navbar navbar-expand-lg">
          <div className="container-fluid">
            <Link className="navbar-brand fw-bold fs-3" to="/app/admin/dashboard">
              <img
                src={logo}
                alt="Frolics badge"
                width="40"
                height="40"
                className="me-2 rounded-3"
              />
              FROLICS
            </Link>

            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#adminNavbarNav"
              aria-controls="adminNavbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse user-navbar-collapse" id="adminNavbarNav">
              <ul className="navbar-nav ms-auto align-items-center">
                <li className="nav-item">
                  <Link className="nav-link px-3 py-2 d-flex align-items-center gap-2" to="/app/admin/dashboard">
                    <FiHome size={18} aria-hidden="true" />
                    <span>Dashboard</span>
                  </Link>
                </li>

                <li className="nav-item dropdown">
                  <button
                    className="nav-link px-3 py-2 dropdown-toggle d-flex align-items-center gap-2"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <FiUsers size={18} aria-hidden="true" />
                    <span>Users</span>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end bg-white/90 backdrop-blur-xl border-white shadow-lg border rounded-3 mt-1">
                    <li>
                      <Link className="dropdown-item px-4 py-2 fw-medium d-flex align-items-center gap-2" to="/app/admin/manage-users">
                        <FiUsers size={16} aria-hidden="true" />
                        <span>All Users</span>
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item px-4 py-2 fw-medium d-flex align-items-center gap-2" to="/app/admin/profile">
                        <FiUser size={16} aria-hidden="true" />
                        <span>Admin Account</span>
                      </Link>
                    </li>
                  </ul>
                </li>

                <li className="nav-item">
                  <Link className="nav-link px-3 py-2 d-flex align-items-center gap-2" to="/app/admin/institutes">
                    <FiFileText size={18} aria-hidden="true" />
                    <span>Institutes</span>
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link px-3 py-2 d-flex align-items-center gap-2" to="/app/admin/departments">
                    <FiClipboard size={18} aria-hidden="true" />
                    <span>Departments</span>
                  </Link>
                </li>

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
                    <li>
                      <Link className="dropdown-item px-4 py-2 fw-medium d-flex align-items-center gap-2" to="/app/admin/events/create">
                        <FiPlus size={16} aria-hidden="true" />
                        <span>Create Event</span>
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item px-4 py-2 fw-medium d-flex align-items-center gap-2" to="/app/admin/events">
                        <FiCalendar size={16} aria-hidden="true" />
                        <span>Event Overview</span>
                      </Link>
                    </li>
                  </ul>
                </li>

                <li className="nav-item">
                  <Link className="nav-link px-3 py-2 d-flex align-items-center gap-2" to="/app/admin/winners">
                    <FiAward size={18} aria-hidden="true" />
                    <span>Winner</span>
                  </Link>
                </li>

                <li className="nav-item dropdown">
                  <button
                    className="nav-link dropdown-toggle px-3 py-2 d-flex align-items-center gap-2"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    aria-label="Admin menu"
                  >
                    <div
                      className="avatar bg-gradient rounded-circle d-flex align-items-center justify-content-center text-white fw-bold fs-6"
                      style={{ width: '32px', height: '32px' }}
                    >
                      <FiUser size={16} aria-hidden="true" />
                    </div>
                    {/* <span className="d-none d-md-inline">{displayName}</span> */}
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
                          <h6 className="mb-0 fw-semibold">{displayName}</h6>
                          <small className="text-muted">{displayEmail}</small>
                        </div>
                      </div>
                    </li>
                    <li>
                      <Link className="dropdown-item px-4 py-3 fw-medium d-flex align-items-center gap-2" to="/app/admin/profile">
                        <FiUser size={16} aria-hidden="true" />
                        <span>View Profile</span>
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider mx-3 opacity-50" />
                    </li>
                    <li>
                      <button
                        className="dropdown-item px-4 py-3 fw-medium d-flex align-items-center gap-2"
                        onClick={logoutAndRedirect}
                      >
                        <FiLogOut size={16} aria-hidden="true" />
                        <span>Logout</span>
                      </button>
                    </li>
                  </ul>
                </li>

                {/* Attendance nav removed (access via Dashboard widget) */}
              </ul>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default AdminNavbar;
