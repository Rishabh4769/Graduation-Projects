import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiActivity,
  FiUsers,
  FiClipboard,
  FiTrendingUp,
  FiBarChart2,
  FiAward,
  FiCalendar,
} from 'react-icons/fi';
import axios from 'axios';
import '../../styles/Users/userDashboardPro.css';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snapshot, setSnapshot] = useState({
    totalUsers: 0,
    nonAdminUsers: 0,
    totalEvents: 0,
    totalGroups: 0,
    totalParticipants: 0,
    totalWinners: 0,
  });

  useEffect(() => {
    async function loadSnapshot() {
      setLoading(true);
      setError('');

      try {
        const [usersRes, eventsRes, groupsRes, participantsRes, winnersRes] = await Promise.all([
          axios.get('/users'),
          axios.get('/events'),
          axios.get('/groups'),
          axios.get('/participants'),
          axios.get('/winners'),
        ]);

        const users = Array.isArray(usersRes.data) ? usersRes.data : [];
        const events = Array.isArray(eventsRes.data) ? eventsRes.data : [];
        const groups = Array.isArray(groupsRes.data) ? groupsRes.data : [];
        const participants = Array.isArray(participantsRes.data) ? participantsRes.data : [];
        const winners = Array.isArray(winnersRes.data) ? winnersRes.data : [];

        setSnapshot({
          totalUsers: users.length,
          nonAdminUsers: users.filter((u) => (u.role || '').toLowerCase() !== 'admin').length,
          totalEvents: events.length,
          totalGroups: groups.length,
          totalParticipants: participants.length,
          totalWinners: winners.length,
        });
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load snapshot');
      } finally {
        setLoading(false);
      }
    }

    loadSnapshot();
  }, []);

  const reportCards = [
    { label: 'Events', value: snapshot.totalEvents, icon: <FiCalendar />, accent: 'gradient-blue' },
    { label: 'Users', value: snapshot.totalUsers, icon: <FiUsers />, accent: 'gradient-green', detail: `${snapshot.nonAdminUsers} participants` },
    { label: 'Groups', value: snapshot.totalGroups, icon: <FiClipboard />, accent: 'gradient-orange' },
    { label: 'Participants', value: snapshot.totalParticipants, icon: <FiTrendingUp />, accent: 'gradient-purple' },
    { label: 'Winner Records', value: snapshot.totalWinners, icon: <FiAward />, accent: 'gradient-blue' },
  ];

  return (
    <main className="user-dashboard">
      <div className="dashboard-header">
          <div className="header-content">
            <h1>Admin Dashboard</h1>
            <p>Manage events, users, institutes, and winner records from one place</p>
          </div>
          <Link to="/app/admin/events/create" className="btn-primary-header">Create Event</Link>
      </div>

        <section className="stats-section">
          {reportCards.map((card) => (
            <div key={card.label} className={`stat-card ${card.accent}`}>
              <div className="stat-icon">{card.icon}</div>
              <div className="stat-label">{card.label}</div>
              <div className="stat-value">{loading ? '...' : card.value}</div>
              <p className="stat-detail">{loading ? '' : card.detail || 'Live data'}</p>
            </div>
          ))}
          <div className="stat-card gradient-green">
            <div className="stat-icon"><FiClipboard /></div>
            <div className="stat-label">Attendance</div>
            <div className="stat-value">Mark presence</div>
            <p className="stat-detail">Open attendance board</p>
            <Link to="/app/admin/attendance" className="btn btn-light btn-sm mt-2">Go to Attendance</Link>
          </div>
        </section>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <div className="dashboard-grid">
          <section className="dashboard-card full-width">
            <div className="card-header">
              <h2>Administrative Tools</h2>
            </div>
            <div className="dashboard-grid">
              <Link to="/app/admin/events/create" className="action-card">
                <FiActivity className="action-icon" aria-hidden="true" size={32} />
                <h4>Create Event</h4>
                <p>Add a new event to the platform</p>
              </Link>
              <Link to="/app/admin/events" className="action-card">
                <FiBarChart2 className="action-icon" aria-hidden="true" size={32} />
                <h4>Event Overview</h4>
                <p>Review all event records in a compact grid</p>
              </Link>
              <Link to="/app/admin/attendance" className="action-card">
                <FiClipboard className="action-icon" aria-hidden="true" size={32} />
                <h4>Attendance</h4>
                <p>Mark group presence per event</p>
              </Link>
              <Link to="/app/admin/manage-users" className="action-card">
                <FiUsers className="action-icon" aria-hidden="true" size={32} />
                <h4>Manage Users</h4>
                <p>Review and manage user accounts</p>
              </Link>
              <Link to="/app/admin/institutes" className="action-card">
                <FiClipboard className="action-icon" aria-hidden="true" size={32} />
                <h4>Manage Institutes</h4>
                <p>Create and update institute records</p>
              </Link>
              <Link to="/app/admin/winners" className="action-card">
                <FiBarChart2 className="action-icon" aria-hidden="true" size={32} />
                <h4>Manage Winners</h4>
                <p>Update event-wise winner entries</p>
              </Link>
              <Link to="/app/admin/profile" className="action-card">
                <FiTrendingUp className="action-icon" aria-hidden="true" size={32} />
                <h4>Admin Account</h4>
                <p>Review admin account information</p>
              </Link>
            </div>
          </section>
        </div>
    </main>
  );
};

export default AdminDashboard;
