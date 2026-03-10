import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiAward, FiCalendar } from 'react-icons/fi';
import axios from 'axios';
import '../../styles/Users/userDashboardPro.css';

const AdminWinners = () => {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadWinnerRecords() {
      setLoading(true);
      setError('');

      try {
        const [winnersResponse, eventsResponse, groupsResponse] = await Promise.all([
          axios.get('/winners'),
          axios.get('/events'),
          axios.get('/groups'),
        ]);

        const winnerItems = Array.isArray(winnersResponse.data) ? winnersResponse.data : [];
        const events = Array.isArray(eventsResponse.data) ? eventsResponse.data : [];
        const groups = Array.isArray(groupsResponse.data) ? groupsResponse.data : [];

        const eventMap = new Map(events.map((event) => [String(event._id), event]));
        const groupMap = new Map(groups.map((group) => [String(group._id), group]));

        const normalized = winnerItems.map((item) => {
          const event = eventMap.get(String(item.eventId));
          const group = groupMap.get(String(item.groupId));

          return {
            id: item._id,
            eventName: event?.eventName || 'Unknown Event',
            winnerName: group?.groupName || 'Unknown Group',
            sequence: item.sequence,
            date: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'No date',
          };
        });

        setWinners(normalized);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load winner records');
      } finally {
        setLoading(false);
      }
    }

    loadWinnerRecords();
  }, []);

  return (
    <main className="user-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Event Winners</h1>
          <p>Maintain event-wise winner entries and publish final outcomes</p>
        </div>
        <Link to="/app/admin/events/create" className="btn-primary-header">Create Event</Link>
      </div>

      <section className="dashboard-card full-width">
        <div className="card-header">
          <h2>Winner Records</h2>
          <Link to="/app/admin/institutes" className="view-all">Institutes <FiArrowRight /></Link>
        </div>
        <div className="events-list">
          {loading && (
            <div className="event-item">
              <div className="event-info">
                <h4>Loading winner records...</h4>
              </div>
            </div>
          )}
          {error && (
            <div className="event-item">
              <div className="event-info">
                <h4>Failed to load winner records</h4>
                <div className="event-meta">
                  <span className="event-date">{error}</span>
                </div>
              </div>
            </div>
          )}
          {!loading && !error && winners.length === 0 && (
            <div className="event-item">
              <div className="event-info">
                <h4>No winner records found</h4>
              </div>
            </div>
          )}
          {winners.map((item) => (
            <div key={item.id} className="event-item">
              <div className="event-info">
                <h4>{item.eventName}</h4>
                <div className="event-meta">
                  <span className="event-date"><FiCalendar aria-hidden="true" /> {item.date}</span>
                  <span className="event-badge badge-live">Position #{item.sequence}</span>
                </div>
              </div>
              <span className="event-category d-flex align-items-center gap-2">
                <FiAward aria-hidden="true" />
                {item.winnerName}
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default AdminWinners;
