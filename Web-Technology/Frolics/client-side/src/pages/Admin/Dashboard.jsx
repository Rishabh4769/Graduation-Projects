import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiActivity, FiUsers, FiClipboard, FiTrendingUp, FiBarChart2 } from 'react-icons/fi';
import axios from 'axios';
import '../../styles/Users/userDashboardPro.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalEvents: 24,
    activeUsers: 0,
    totalRegistrations: 487,
    upcomingEvents: 8,
    participationRate: 78,
    totalUsers: 0,
    totalAdmins: 0,
  });
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState('');

  useEffect(() => {
    async function loadUsers() {
      setUsersLoading(true);
      setUsersError('');

      try {
        const response = await axios.get('/users');
        const users = Array.isArray(response.data) ? response.data : [];
        const activeUsers = users.filter((user) => user.isActive !== false).length;
        const totalAdmins = users.filter((user) => (user.role || '').toLowerCase() === 'admin').length;

        setStats((currentStats) => ({
          ...currentStats,
          totalUsers: users.length,
          activeUsers,
          totalAdmins,
        }));
      } catch (error) {
        setUsersError(error.response?.data?.message || error.message || 'Failed to load user metrics');
      } finally {
        setUsersLoading(false);
      }
    }

    loadUsers();
  }, []);

  const statCards = [
    { icon: <FiClipboard />, label: 'Total Events', value: stats.totalEvents, change: '3 this month' },
    {
      icon: <FiUsers />,
      label: 'Total Users',
      value: usersLoading ? '...' : stats.totalUsers,
      change: usersError || `${stats.activeUsers} active accounts`,
    },
    {
      icon: <FiActivity />,
      label: 'Admin Accounts',
      value: usersLoading ? '...' : stats.totalAdmins,
      change: usersError || 'Fetched from live user records',
    },
    { icon: <FiTrendingUp />, label: 'Participation Rate', value: `${stats.participationRate}%`, change: 'Healthy engagement' }
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
          {statCards.map((s, idx) => (
            <div
              key={idx}
              className={`stat-card ${['gradient-blue', 'gradient-purple', 'gradient-orange', 'gradient-green'][idx]}`}
            >
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{s.value}</div>
              <p className="stat-detail">{s.change}</p>
            </div>
          ))}
        </section>

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
