import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiUsers, FiAward, FiCheckCircle, FiArrowRight, FiSettings } from 'react-icons/fi';
import '../../styles/Users/userDashboardPro.css';

const UserDashboard = () => {
  const [stats] = useState({
    totalEvents: 12,
    groupMembers: 5,
    totalWins: 3,
    attendance: 92,
    upcomingEvents: 2
  });

  const recentEvents = [
    { id: 1, name: 'Web Development Hackathon', date: 'Feb 20, 2026', status: 'upcoming', category: 'Technical' },
    { id: 2, name: 'Cultural Fest 2026', date: 'Feb 15, 2026', status: 'live', category: 'Non-Technical' },
    { id: 3, name: 'Annual Sports Meet', date: 'Feb 10, 2026', status: 'completed', category: 'Sports' }
  ];

  const myGroups = [
    { id: 1, name: 'Tech Innovators', members: 4, events: 3 },
    { id: 2, name: 'Cultural Club', members: 8, events: 5 }
  ];

  return (
    <main className="user-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Welcome Back!</h1>
          <p>Here's an overview of your Frolics activities</p>
        </div>
        <Link to="/app/events" className="btn-primary-header">Explore Events</Link>
      </div>

      <section className="stats-section">
        <div className="stat-card gradient-blue">
          <div className="stat-header">
            <FiCalendar className="stat-icon" aria-hidden="true" />
            <span className="stat-label">Upcoming Events</span>
          </div>
          <div className="stat-value">{stats.upcomingEvents}</div>
          <p className="stat-detail">You're registered for {stats.totalEvents} events this year</p>
        </div>

        <div className="stat-card gradient-purple">
          <div className="stat-header">
            <FiUsers className="stat-icon" aria-hidden="true" />
            <span className="stat-label">Group Members</span>
          </div>
          <div className="stat-value">{stats.groupMembers}</div>
          <p className="stat-detail">Collaborate with {stats.groupMembers} teammates</p>
        </div>

        <div className="stat-card gradient-orange">
          <div className="stat-header">
            <FiAward className="stat-icon" aria-hidden="true" />
            <span className="stat-label">Total Wins</span>
          </div>
          <div className="stat-value">{stats.totalWins}</div>
          <p className="stat-detail">Great achievements this year!</p>
        </div>

        <div className="stat-card gradient-green">
          <div className="stat-header">
            <FiCheckCircle className="stat-icon" aria-hidden="true" />
            <span className="stat-label">Attendance Rate</span>
          </div>
          <div className="stat-value">{stats.attendance}%</div>
          <p className="stat-detail">Excellent engagement score</p>
        </div>
      </section>

      <div className="dashboard-grid">
        <section className="dashboard-card">
          <div className="card-header">
            <h2>Recent Events</h2>
            <Link to="/app/events" className="view-all">View All <FiArrowRight /></Link>
          </div>
          <div className="events-list">
            {recentEvents.map(event => (
              <div key={event.id} className="event-item">
                <div className="event-info">
                  <h4>{event.name}</h4>
                  <div className="event-meta">
                    <span className="event-date">{event.date}</span>
                    <span className={`event-badge badge-${event.status}`}>{event.status}</span>
                  </div>
                </div>
                <span className="event-category">{event.category}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-card">
          <div className="card-header">
            <h2>My Teams</h2>
            <Link to="/app/groups" className="view-all">View All <FiArrowRight /></Link>
          </div>
          <div className="groups-list">
            {myGroups.map(group => (
              <div key={group.id} className="group-item">
                <div className="group-avatar">{group.name.charAt(0)}</div>
                <div className="group-info">
                  <h4>{group.name}</h4>
                  <p>{group.members} members • {group.events} events</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="dashboard-card full-width">
        <div className="card-header">
          <h2>Quick Actions</h2>
        </div>
        <div className="quick-actions-grid">
          <Link to="/app/events" className="action-card">
            <FiCalendar className="action-icon" aria-hidden="true" size={32} />
            <h4>Browse Events</h4>
            <p>Find and register for upcoming events</p>
          </Link>
          <Link to="/app/groups" className="action-card">
            <FiUsers className="action-icon" aria-hidden="true" size={32} />
            <h4>Create Group</h4>
            <p>Build your team for upcoming competitions</p>
          </Link>
          <Link to="/app/profile" className="action-card">
            <FiSettings className="action-icon" aria-hidden="true" size={32} />
            <h4>Edit Profile</h4>
            <p>Update your profile and preferences</p>
          </Link>
          <Link to="/app/events" className="action-card">
            <FiAward className="action-icon" aria-hidden="true" size={32} />
            <h4>View Results</h4>
            <p>Check your achievements and rankings</p>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default UserDashboard;
