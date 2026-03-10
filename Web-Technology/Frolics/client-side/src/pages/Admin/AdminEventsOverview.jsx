import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCalendar, FiEdit3, FiMapPin, FiTag, FiTrash2, FiUsers } from 'react-icons/fi';
import axios from 'axios';
import '../../styles/Users/userDashboardPro.css';

const AdminEventsOverview = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    setLoading(true);
    setError('');

    try {
      const [eventsResponse, departmentsResponse] = await Promise.all([
        axios.get('/events'),
        axios.get('/departments'),
      ]);

      const eventList = Array.isArray(eventsResponse.data) ? eventsResponse.data : [];
      const departmentList = Array.isArray(departmentsResponse.data) ? departmentsResponse.data : [];
      const departmentMap = new Map(
        departmentList.map((department) => [String(department._id), department.departmentName])
      );

      const normalized = eventList.map((event) => ({
        id: event._id,
        name: event.eventName || 'Untitled Event',
        tagline: event.eventTagline || 'No tagline provided',
        location: event.eventLocation || 'Location not set',
        status: event.eventStatus || 'upcoming',
        date: event.eventDate ? new Date(event.eventDate).toLocaleDateString() : 'No date set',
        departmentName: departmentMap.get(String(event.departmentId)) || 'Unknown Department',
        fee: event.eventFees ?? 0,
        groupRange: `${event.groupMinParticipants || 0}-${event.groupMaxParticipants || 0}`,
      }));

      setEvents(normalized);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load event overview');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(eventId) {
    setError('');

    try {
      await axios.delete(`/events/${eventId}`);
      await loadEvents();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete event');
    }
  }

  return (
    <main className="user-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Event Overview</h1>
          <p>Browse every event from the database in one compact admin grid</p>
        </div>
        <Link to="/app/admin/events/create" className="btn-primary-header">Create Event</Link>
      </div>

      <section className="dashboard-card full-width">
        <div className="card-header">
          <h2>All Events</h2>
          <Link to="/app/admin/dashboard" className="view-all">Back to Dashboard <FiArrowRight /></Link>
        </div>

        {loading && (
          <div className="event-item">
            <div className="event-info">
              <h4>Loading events...</h4>
            </div>
          </div>
        )}

        {error && (
          <div className="event-item">
            <div className="event-info">
              <h4>Failed to load events</h4>
              <div className="event-meta">
                <span className="event-date">{error}</span>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && events.length === 0 && (
          <div className="event-item">
            <div className="event-info">
              <h4>No events found</h4>
            </div>
          </div>
        )}

        {!loading && !error && events.length > 0 && (
          <div className="quick-actions-grid">
            {events.map((event) => (
              <article key={event.id} className="action-card text-start">
                <FiCalendar className="action-icon" aria-hidden="true" size={28} />
                <h4>{event.name}</h4>
                <p>{event.tagline}</p>
                <div className="events-list" style={{ marginTop: '1rem', gap: '0.75rem' }}>
                  <div className="event-item">
                    <div className="event-info">
                      <div className="event-meta">
                        <span className="event-date"><FiTag aria-hidden="true" /> {event.departmentName}</span>
                      </div>
                    </div>
                  </div>
                  <div className="event-item">
                    <div className="event-info">
                      <div className="event-meta">
                        <span className="event-date"><FiMapPin aria-hidden="true" /> {event.location}</span>
                        <span className={`event-badge badge-${event.status}`}>{event.status}</span>
                      </div>
                    </div>
                  </div>
                  <div className="event-item">
                    <div className="event-info">
                      <div className="event-meta">
                        <span className="event-date"><FiUsers aria-hidden="true" /> Group size: {event.groupRange}</span>
                        <span className="event-date"><FiCalendar aria-hidden="true" /> {event.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p style={{ marginTop: '1rem' }}>Entry fee: Rs. {event.fee}</p>
                <div className="d-flex gap-2" style={{ marginTop: '1rem' }}>
                  <Link className="btn btn-sm btn-outline-primary" to={`/app/admin/events/${event.id}/edit`}>
                    <FiEdit3 aria-hidden="true" /> Edit
                  </Link>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(event.id)}
                  >
                    <FiTrash2 aria-hidden="true" /> Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default AdminEventsOverview;
