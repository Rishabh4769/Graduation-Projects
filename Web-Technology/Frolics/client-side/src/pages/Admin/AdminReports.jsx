import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiAward,
  FiCalendar,
  FiClipboard,
  FiUsers,
} from 'react-icons/fi';
import axios from 'axios';
import '../../styles/Users/userDashboardPro.css';

const AdminReports = () => {
  const [metrics, setMetrics] = useState({
    users: 0,
    nonAdminUsers: 0,
    events: 0,
    groups: 0,
    participants: 0,
    winners: 0,
  });
  const [recentEvents, setRecentEvents] = useState([]);
  const [recentGroups, setRecentGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadReports() {
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

        const nonAdminUsers = users.filter((user) => (user.role || '').toLowerCase() !== 'admin');

        setMetrics({
          users: users.length,
          nonAdminUsers: nonAdminUsers.length,
          events: events.length,
          groups: groups.length,
          participants: participants.length,
          winners: winners.length,
        });

        setRecentEvents(events.slice(0, 4));
        setRecentGroups(groups.slice(0, 5));
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load reports');
      } finally {
        setLoading(false);
      }
    }

    loadReports();
  }, []);

  const summaryCards = useMemo(() => ([
    { label: 'Total Users', value: loading ? '...' : metrics.users, sub: `${metrics.nonAdminUsers} non-admins`, icon: <FiUsers /> },
    { label: 'Events', value: loading ? '...' : metrics.events, sub: 'Live + archived', icon: <FiCalendar /> },
    { label: 'Groups', value: loading ? '...' : metrics.groups, sub: 'Across all events', icon: <FiClipboard /> },
    { label: 'Participants', value: loading ? '...' : metrics.participants, sub: 'Registered profiles', icon: <FiUsers /> },
    { label: 'Winner Records', value: loading ? '...' : metrics.winners, sub: 'Event-wise winners', icon: <FiAward /> },
  ]), [loading, metrics]);

  return (
    <main className="user-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Reports</h1>
          <p>High-level metrics for users, events, groups, and winners</p>
        </div>
        <Link to="/app/admin/events" className="btn-primary-header">Event Overview</Link>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <section className="stats-section">
        {summaryCards.map((card) => (
          <div key={card.label} className="stat-card gradient-purple">
            <div className="stat-icon">{card.icon}</div>
            <div className="stat-label">{card.label}</div>
            <div className="stat-value">{card.value}</div>
            <p className="stat-detail">{card.sub}</p>
          </div>
        ))}
      </section>

      <div className="dashboard-grid">
        <section className="dashboard-card">
          <div className="card-header">
            <h2>Recent Events</h2>
            <Link to="/app/admin/events" className="view-all">Manage events</Link>
          </div>
          {loading && <p className="text-muted">Loading events...</p>}
          {!loading && recentEvents.length === 0 && <p className="text-muted">No events found.</p>}
          {!loading && recentEvents.length > 0 && (
            <ul className="list-group list-group-flush">
              {recentEvents.map((event) => (
                <li key={event._id || event.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <div className="fw-semibold">{event.eventName || event.title || 'Untitled event'}</div>
                    <small className="text-muted">{event.eventStatus || 'upcoming'}</small>
                  </div>
                  <FiCalendar aria-hidden="true" />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="dashboard-card">
          <div className="card-header">
            <h2>Group Snapshot</h2>
            <Link to="/app/admin/attendance" className="view-all">Attendance</Link>
          </div>
          {loading && <p className="text-muted">Loading groups...</p>}
          {!loading && recentGroups.length === 0 && <p className="text-muted">No groups found.</p>}
          {!loading && recentGroups.length > 0 && (
            <div className="table-scroll-wrap">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th scope="col">Group</th>
                    <th scope="col">Event</th>
                    <th scope="col">Presence</th>
                  </tr>
                </thead>
                <tbody>
                  {recentGroups.map((group) => (
                    <tr key={group._id || group.id}>
                      <td>{group.groupName || 'Untitled group'}</td>
                      <td>{group.eventId || '—'}</td>
                      <td>
                        <span className={`badge ${group.isPresent ? 'bg-success' : 'bg-secondary'}`}>
                          {group.isPresent ? 'Present' : 'Not marked'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default AdminReports;
