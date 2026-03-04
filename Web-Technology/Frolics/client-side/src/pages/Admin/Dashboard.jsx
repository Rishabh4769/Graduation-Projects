import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiActivity, FiUsers, FiClipboard, FiTrendingUp, FiArrowRight, FiBarChart2, FiSettings } from 'react-icons/fi';
import '../../styles/Admin/adminDashboard.modern.css';

const AdminDashboard = () => {
  const [stats] = useState({
    totalEvents: 24,
    activeUsers: 156,
    totalRegistrations: 487,
    upcomingEvents: 8,
    participationRate: 78,
    avgAttendance: 85
  });

  const recentEvents = [
    { id: 1, name: 'Web Development Hackathon', registrations: 45, status: 'upcoming', date: 'Feb 20, 2026' },
    { id: 2, name: 'Cultural Fest 2026', registrations: 89, status: 'live', date: 'Feb 15, 2026' },
    { id: 3, name: 'Annual Sports Meet', registrations: 120, status: 'completed', date: 'Feb 10, 2026' }
  ];

  const topAchievers = [
    { id: 1, name: 'Rahul Patel', wins: 5, badges: 12 },
    { id: 2, name: 'Priya Singh', wins: 4, badges: 10 },
    { id: 3, name: 'Arjun Verma', wins: 3, badges: 9 }
  ];

  return (
    <main className="admin-dashboard">
      <div className="admin-container">
        {/* Admin Header */}
        <div className="admin-header">
          <div className="header-title">
            <h1>Admin Dashboard</h1>
            <p className="header-subtitle">Manage events, users, and platform statistics</p>
          </div>
          <div className="header-actions">
            <Link to="/app/admin/events" className="btn-primary">Create Event</Link>
            <Link to="/app/admin/users" className="btn-secondary">Manage Users</Link>
          </div>
        </div>

        {/* Key Stats grid */}
        <div className="dashboard-grid">
          {stats && [
            { icon: <FiClipboard />, label: 'Total Events', value: stats.totalEvents, change: '3 this month' },
            { icon: <FiUsers />, label: 'Active Users', value: stats.activeUsers, change: '12 new users' },
            { icon: <FiActivity />, label: 'Registrations', value: stats.totalRegistrations, change: '45 this week' },
            { icon: <FiTrendingUp />, label: 'Participation Rate', value: stats.participationRate + '%', change: 'Healthy engagement' }
          ].map((s, idx) => (
            <div key={idx} className="stat-card">
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-change">{s.change}</div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="dashboard-grid">
          {/* Recent Events */}
          <section className="dashboard-card">
            <div className="card-header">
              <h2>Recent Events</h2>
              <Link to="/app/admin/events" className="view-all">Manage All <FiArrowRight /></Link>
            </div>
            <div className="dashboard-grid">
              {recentEvents.map(event => (
                <div key={event.id} className="event-card">
                  <div className="event-image" />
                  <div className="event-content">
                    <h3>{event.name}</h3>
                    <p className="text-muted small">{event.date}</p>
                    <div className="d-flex justify-content-between align-items-center mt-2">
                      <span className="badge badge-primary">{event.status}</span>
                      <span className="text-muted small">{event.registrations} regs</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Top Achievers */}
          <section className="dashboard-card">
            <div className="card-header">
              <h2>Top Achievers</h2>
              <Link to="/app/admin/leaderboard" className="view-all">View Leaderboard <FiArrowRight /></Link>
            </div>
            <div className="dashboard-grid">
              {topAchievers.map((achiever, idx) => (
                <div key={achiever.id} className="card stat-card">
                  <div className="stat-icon">{idx + 1}</div>
                  <div className="stat-label">{achiever.name}</div>
                  <div className="stat-value">{achiever.wins} wins</div>
                  <div className="stat-change">{achiever.badges} badges</div>
                </div>
              ))}
            </div>
          </section>

          {/* Administrative Actions */}
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
              <Link to="/app/admin/users" className="action-card">
                <FiUsers className="action-icon" aria-hidden="true" size={32} />
                <h4>Manage Users</h4>
                <p>Review and manage user accounts</p>
              </Link>
              <Link to="/app/admin/registrations" className="action-card">
                <FiClipboard className="action-icon" aria-hidden="true" size={32} />
                <h4>View Registrations</h4>
                <p>Monitor event registrations</p>
              </Link>
              <Link to="/app/admin/analytics" className="action-card">
                <FiBarChart2 className="action-icon" aria-hidden="true" size={32} />
                <h4>Analytics</h4>
                <p>View detailed platform analytics</p>
              </Link>
              <Link to="/app/admin/reports" className="action-card">
                <FiTrendingUp className="action-icon" aria-hidden="true" size={32} />
                <h4>Generate Reports</h4>
                <p>Create custom reports</p>
              </Link>
              <Link to="/app/admin/settings" className="action-card">
                <FiSettings className="action-icon" aria-hidden="true" size={32} />
                <h4>Settings</h4>
                <p>Platform configuration</p>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;
