import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Admin/adminEventForm.css';
import { fetchJson } from '../../utils/api';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    eventName: '',
    eventTagline: '',
    eventImage: '',
    eventDescription: '',
    groupMinParticipants: 1,
    groupMaxParticipants: 1,
    eventFees: 0,
    eventFirstPrize: '',
    eventSecondPrize: '',
    eventThirdPrize: '',
    eventLocation: '',
    maxGroupsAllowed: 50,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await fetchJson('/events', { method: 'POST', body: JSON.stringify(form) });
      navigate('/app/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="main container">
      <h1>Create Event</h1>
      <div className="event-card" style={{ maxWidth: 900 }}>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Event name</label>
              <input name="eventName" className="form-control" value={form.eventName} onChange={handleChange} required />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Tagline</label>
              <input name="eventTagline" className="form-control" value={form.eventTagline} onChange={handleChange} />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea name="eventDescription" className="form-control" rows={4} value={form.eventDescription} onChange={handleChange} />
          </div>

          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label">Min participants</label>
              <input type="number" name="groupMinParticipants" className="form-control" value={form.groupMinParticipants} onChange={handleChange} />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Max participants</label>
              <input type="number" name="groupMaxParticipants" className="form-control" value={form.groupMaxParticipants} onChange={handleChange} />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Fees</label>
              <input type="number" name="eventFees" className="form-control" value={form.eventFees} onChange={handleChange} />
            </div>
          </div>

          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label">First prize</label>
              <input name="eventFirstPrize" className="form-control" value={form.eventFirstPrize} onChange={handleChange} />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Second prize</label>
              <input name="eventSecondPrize" className="form-control" value={form.eventSecondPrize} onChange={handleChange} />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Third prize</label>
              <input name="eventThirdPrize" className="form-control" value={form.eventThirdPrize} onChange={handleChange} />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Location</label>
            <input name="eventLocation" className="form-control" value={form.eventLocation} onChange={handleChange} />
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="d-flex gap-2">
            <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Saving…' : 'Create Event'}</button>
            <button className="btn btn-outline-secondary" type="button" onClick={() => navigate(-1)}>Cancel</button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default CreateEvent;
