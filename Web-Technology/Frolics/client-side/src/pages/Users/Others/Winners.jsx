import React, { useEffect, useState } from 'react';
import { FiAward, FiCalendar, FiTag } from 'react-icons/fi';
import axios from 'axios';
import '../../../styles/Users/userDashboardPro.css';

const Winners = () => {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadWinners() {
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

        setWinners(
          winnerItems.map((item) => ({
            id: item._id,
            sequence: item.sequence,
            date: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'No date',
            eventName: eventMap.get(String(item.eventId))?.eventName || 'Unknown Event',
            eventTagline: eventMap.get(String(item.eventId))?.eventTagline || 'No tagline',
            winnerName: groupMap.get(String(item.groupId))?.groupName || 'Unknown Group',
          }))
        );
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load winners');
      } finally {
        setLoading(false);
      }
    }

    loadWinners();
  }, []);

  return (
    <main className="user-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Event Winners</h1>
          <p>View published winner records across Frolics events</p>
        </div>
      </div>

      <section className="dashboard-card full-width">
        <div className="card-header">
          <h2>Published Results</h2>
        </div>
        <div className="events-list">
          {loading && (
            <div className="event-item">
              <div className="event-info">
                <h4>Loading winners...</h4>
              </div>
            </div>
          )}
          {error && (
            <div className="event-item">
              <div className="event-info">
                <h4>Failed to load winners</h4>
                <div className="event-meta">
                  <span className="event-date">{error}</span>
                </div>
              </div>
            </div>
          )}
          {!loading && !error && winners.length === 0 && (
            <div className="event-item">
              <div className="event-info">
                <h4>No winner records available</h4>
              </div>
            </div>
          )}
          {winners.map((winner) => (
            <div key={winner.id} className="event-item">
              <div className="event-info">
                <h4>{winner.eventName}</h4>
                <div className="event-meta">
                  <span className="event-date"><FiCalendar aria-hidden="true" /> {winner.date}</span>
                  <span className="event-date"><FiTag aria-hidden="true" /> {winner.eventTagline}</span>
                  <span className="event-badge badge-live">Position #{winner.sequence}</span>
                </div>
              </div>
              <span className="event-category d-flex align-items-center gap-2">
                <FiAward aria-hidden="true" />
                {winner.winnerName}
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Winners;
