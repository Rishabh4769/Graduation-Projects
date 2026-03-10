import { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/Users/partials/globals.css';
import '../../styles/Users/partials/layout.css';

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ userName: '', emailAddress: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      try {
        const raw = localStorage.getItem('user');
        const stored = raw ? JSON.parse(raw) : null;
        let data = null;

        if (stored?.id) {
          data = await axios.get(`/users/${stored.id}`);
        } else if (stored?.email) {
          data = await axios.get(`/users/email/${encodeURIComponent(stored.email)}`);
        } else {
          // no stored user — nothing to fetch
          setProfile(null);
          setLoading(false);
          return;
        }

        setProfile(data);
      } catch (err) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  if (loading) return <main className="main container"><p>Loading profile…</p></main>;

  if (!profile) return (
    <main className="main container">
      <h1>User Profile</h1>
      <p className="text-muted">No profile available. Please login.</p>
    </main>
  );

  const startEdit = () => {
    setForm({ userName: profile.userName || profile.name || '', emailAddress: profile.emailAddress || profile.email || '' });
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setForm({ userName: '', emailAddress: '' });
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const payload = { userName: form.userName, emailAddress: form.emailAddress };
      const updated = await axios.put(`/users/${profile._id || profile.id}`, payload );
      setProfile(updated);
      // update localStorage user if present
      try {
        const raw = localStorage.getItem('user');
        if (raw) {
          const u = JSON.parse(raw);
          u.userName = updated.userName || u.userName;
          u.email = updated.emailAddress || u.email;
          localStorage.setItem('user', JSON.stringify(u));
        }
      } catch (e) { /* ignore */ }
      setEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="main container">
      <h1>{profile.userName || profile.name || 'User'}</h1>

      {!editing ? (
        <div className="event-card" style={{ marginTop: 16 }}>
          <h3 className="event-name">{profile.userName || profile.name}</h3>
          <p className="meta-item">Email: {profile.emailAddress || profile.email}</p>
          {profile.role && <p className="meta-item">Role: {profile.role}</p>}
          <div className="mt-3">
            <button className="btn btn-outline-primary me-2" onClick={startEdit}>Edit profile</button>
          </div>
        </div>
      ) : (
        <div className="event-card" style={{ marginTop: 16, maxWidth: 720 }}>
          <div className="form-group mb-3">
            <label className="form-label">Full name</label>
            <input className="form-control" value={form.userName} onChange={(e) => setForm({ ...form, userName: e.target.value })} />
          </div>
          <div className="form-group mb-3">
            <label className="form-label">Email</label>
            <input className="form-control" value={form.emailAddress} onChange={(e) => setForm({ ...form, emailAddress: e.target.value })} />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="d-flex gap-2">
            <button className="btn btn-primary" onClick={saveProfile} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
            <button className="btn btn-outline-secondary" onClick={cancelEdit}>Cancel</button>
          </div>
        </div>
      )}
    </main>
  );
};

export default UserProfile;
