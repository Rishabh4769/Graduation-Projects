import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../styles/Users/partials/globals.css';
import '../../../styles/Users/partials/layout.css';
import { fetchJson } from '../../../utils/api';

const CreateGroup = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ groupName: '', eventId: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await fetchJson('/events');
        setEvents(data);
      } catch (err) {
        setEvents([]);
      }
    }
    loadEvents();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!form.groupName || !form.eventId) return setError('Please provide group name and event');
    setLoading(true);
    try {
      const userRaw = localStorage.getItem('user');
      const user = userRaw ? JSON.parse(userRaw) : null;
      const payload = { ...form, createdBy: user?.id };
      const saved = await fetchJson('/groups', { method: 'POST', body: JSON.stringify(payload) });
      navigate('/app/groups');
    } catch (err) {
      setError(err.message || 'Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="main container">
      <h1>Create Group</h1>
      <div className="event-card" style={{ maxWidth: 720 }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label className="form-label">Group name</label>
            <input name="groupName" className="form-control" value={form.groupName} onChange={handleChange} placeholder="e.g. Team Alpha" />
          </div>

          <div className="form-group mb-3">
            <label className="form-label">Event</label>
            <select name="eventId" className="form-select" value={form.eventId} onChange={handleChange}>
              <option value="">Select event</option>
              {events.map(ev => (
                <option key={ev._id || ev.id} value={ev._id || ev.id}>{ev.eventName || ev.title || ev.name}</option>
              ))}
            </select>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="d-flex gap-2">
            <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Creating…' : 'Create Group'}</button>
            <button className="btn btn-outline-secondary" type="button" onClick={() => navigate(-1)}>Cancel</button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default CreateGroup;
