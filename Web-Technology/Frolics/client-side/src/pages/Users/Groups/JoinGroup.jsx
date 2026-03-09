import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../../styles/Users/partials/globals.css';
import '../../../styles/Users/partials/layout.css';

const JoinGroup = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [selected, setSelected] = useState('');
  const [form, setForm] = useState({ participantName: '', participantInstituteName: '', participantEmail: '', participantMobile: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadGroups() {
      try {
        const data = await axios.get('/groups');
        setGroups(data);
      } catch (err) {
        setGroups([]);
      }
    }
    loadGroups();
  }, []);

  const handleJoin = async (e) => {
    e.preventDefault();
    setError(null);
    if (!selected) return setError('Select a group to join');
    if (!form.participantName) return setError('Enter your name');
    setLoading(true);
    try {
      const userRaw = localStorage.getItem('user');
      const user = userRaw ? JSON.parse(userRaw) : null;
      const payload = {
        ...form,
        groupId: selected,
        createdBy: user?.id,
        isGroupLeader: false,
      };
      await axios.post('/participants', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      navigate('/app/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to join group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="main container">
      <h1>Join Group</h1>
      <div className="event-card" style={{ maxWidth: 900 }}>
        <div className="mb-3">
          <label className="form-label">Available groups</label>
          <select className="form-select" value={selected} onChange={(e) => setSelected(e.target.value)}>
            <option value="">Select a group</option>
            {groups.map(g => (
              <option key={g._id || g.id} value={g._id || g.id}>{g.groupName} — {g.eventId ? `Event ${g.eventId}` : 'No event'}</option>
            ))}
          </select>
        </div>

        <form onSubmit={handleJoin}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Full name</label>
              <input name="participantName" className="form-control" value={form.participantName} onChange={(e) => setForm({ ...form, participantName: e.target.value })} />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Institute</label>
              <input name="participantInstituteName" className="form-control" value={form.participantInstituteName} onChange={(e) => setForm({ ...form, participantInstituteName: e.target.value })} />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Email</label>
              <input name="participantEmail" className="form-control" value={form.participantEmail} onChange={(e) => setForm({ ...form, participantEmail: e.target.value })} />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Mobile</label>
              <input name="participantMobile" className="form-control" value={form.participantMobile} onChange={(e) => setForm({ ...form, participantMobile: e.target.value })} />
            </div>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="d-flex gap-2">
            <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Joining…' : 'Join Group'}</button>
            <button className="btn btn-outline-secondary" type="button" onClick={() => navigate(-1)}>Cancel</button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default JoinGroup;
