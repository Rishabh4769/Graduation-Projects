import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../../../styles/Users/partials/globals.css';
import '../../../styles/Users/partials/layout.css';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await axios.get(`/events/${id}`);
        setEvent(data);
      } catch (e) {
        setEvent(null);
      }
    }
    load();
  }, [id]);

  if (!event) return <main className="main container">Loading...</main>;

  return (
    <main className="main container">
      <h1>{event.title || event.eventName}</h1>
      <div className="event-card">
        <p>{event.description || event.eventDescription}</p>
        <div className="event-meta">
          <div className="meta-item"><span>Date:</span><span>{event.date || event.eventDate || 'TBD'}</span></div>
          <div className="meta-item"><span>Venue:</span><span>{event.venue || event.eventLocation || 'TBD'}</span></div>
        </div>

        <div className="mt-3 d-flex gap-2">
          <Link className="btn btn-primary" to="/app/groups/create">Create group</Link>
          <Link className="btn btn-outline-primary" to="/app/groups/join">Join existing group</Link>
        </div>
      </div>
    </main>
  );
};

export default EventDetails;
