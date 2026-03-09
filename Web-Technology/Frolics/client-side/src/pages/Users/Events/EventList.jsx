import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../../styles/Users/partials/globals.css';
import '../../../styles/Users/partials/layout.css';
import '../../../styles/Users/eventTypes.css';
import EventTypeCard from '../../../components/Users/EventTypeCard';

const EventList = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await axios.get('/events');
        setEvents(data || []);
      } catch (e) {
        setEvents([]);
      }
    }
    load();
  }, []);

  return (
    <main className="main container">
      <h1>Events</h1>

      {/* Event types — prominent, large cards */}
      <section className="event-types-section">
        <div className="event-types-grid">
          <EventTypeCard title="Technical" subtitle="Coding, Robotics, Hackathons" icon="🛠️" color="#3b82f6" />
          <EventTypeCard title="Cultural" subtitle="Dance, Music, Drama" icon="🎭" color="#ef4444" />
          <EventTypeCard title="Games" subtitle="Tournaments & Matches" icon="🏆" color="#f59e0b" />
          <EventTypeCard title="Non-Technical" subtitle="Hands-on learning" icon="🧰" color="#10b981" />
        </div>
      </section>
      <div className="row events-grid">
        {events.length === 0 && <p>No events yet</p>}
        {events.map((ev) => (
          <div key={ev._id} className="col-md-4">
            <article className="event-card">
              <div className="event-header">
                <h3 className="event-name">{ev.title}</h3>
                <span className={`status-badge ${ev.status || 'upcoming'}`}>{ev.status || 'upcoming'}</span>
              </div>
              <div className="event-meta">
                <div className="meta-item"><span>Date:</span><span>{ev.date}</span></div>
                <div className="meta-item"><span>Venue:</span><span>{ev.venue}</span></div>
              </div>
              <a className="read-more" href={`/events/${ev._id}`}>View details →</a>
            </article>
          </div>
        ))}
      </div>
    </main>
  );
};

export default EventList;
