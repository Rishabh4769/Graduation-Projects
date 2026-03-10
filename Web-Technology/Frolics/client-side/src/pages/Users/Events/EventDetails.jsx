import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiAward, FiCalendar, FiMapPin, FiTag, FiUsers } from 'react-icons/fi';
import axios from 'axios';
import '../../../styles/Users/userDashboardPro.css';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const response = await axios.get(`/events/${id}`);
        setEvent(response.data || null);
      } catch (e) {
        setEvent(null);
      }
    }
    load();
  }, [id]);

  if (!event) return <main className="user-dashboard"><div className="dashboard-card"><h2>Loading event...</h2></div></main>;

  const formattedDate = event.eventDate ? new Date(event.eventDate).toLocaleDateString() : 'Date not set';

  return (
    <main className="user-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>{event.eventName || 'Event Details'}</h1>
          <p>{event.eventTagline || 'Explore event information, coordination details, and participation rules.'}</p>
        </div>
        <span className={`event-badge badge-${event.eventStatus || 'upcoming'}`}>{event.eventStatus || 'upcoming'}</span>
      </div>

      <div className="dashboard-grid">
        <section className="dashboard-card">
          <div className="card-header">
            <h2>Overview</h2>
          </div>
          <p>{event.eventDescription || 'No event description available.'}</p>
          <div className="events-list">
            <div className="event-item">
              <div className="event-info">
                <h4><FiCalendar aria-hidden="true" /> Event Date</h4>
                <div className="event-meta">
                  <span className="event-date">{formattedDate}</span>
                </div>
              </div>
            </div>
            <div className="event-item">
              <div className="event-info">
                <h4><FiMapPin aria-hidden="true" /> Venue</h4>
                <div className="event-meta">
                  <span className="event-date">{event.eventLocation || 'Venue not set'}</span>
                </div>
              </div>
            </div>
            <div className="event-item">
              <div className="event-info">
                <h4><FiTag aria-hidden="true" /> Status</h4>
                <div className="event-meta">
                  <span className={`event-badge badge-${event.eventStatus || 'upcoming'}`}>{event.eventStatus || 'upcoming'}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="dashboard-card">
          <div className="card-header">
            <h2>Participation</h2>
          </div>
          <div className="groups-list">
            <div className="group-item">
              <div className="group-avatar"><FiUsers aria-hidden="true" /></div>
              <div className="group-info">
                <h4>Group Size</h4>
                <p>{event.groupMinParticipants || 0} to {event.groupMaxParticipants || 0} participants</p>
              </div>
            </div>
            <div className="group-item">
              <div className="group-avatar"><FiTag aria-hidden="true" /></div>
              <div className="group-info">
                <h4>Entry Fee</h4>
                <p>Rs. {event.eventFees ?? 0}</p>
              </div>
            </div>
            <div className="group-item">
              <div className="group-avatar"><FiAward aria-hidden="true" /></div>
              <div className="group-info">
                <h4>Prizes</h4>
                <p>1st: {event.eventFirstPrize || 'TBD'}</p>
                <p>2nd: {event.eventSecondPrize || 'TBD'}</p>
                <p>3rd: {event.eventThirdPrize || 'TBD'}</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="dashboard-card full-width">
        <div className="card-header">
          <h2>Quick Actions</h2>
        </div>
        <div className="quick-actions-grid">
          <Link className="action-card" to="/app/groups/create">
            <FiUsers className="action-icon" aria-hidden="true" size={32} />
            <h4>Create Group</h4>
            <p>Create your team for this event</p>
          </Link>
          <Link className="action-card" to="/app/groups/join">
            <FiUsers className="action-icon" aria-hidden="true" size={32} />
            <h4>Join Existing Group</h4>
            <p>Join a registered group for participation</p>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default EventDetails;
