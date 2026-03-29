import { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/Users/partials/globals.css';
import '../../styles/Users/partials/layout.css';
import { getStoredUser } from '../../utils/auth';

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ userName: '', phoneNumber: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      try {
        const sessionUser = getStoredUser();
        const data = sessionUser?.id
          ? await axios.get(`/users/${sessionUser.id}`)
          : sessionUser?.email
            ? await axios.get(`/users/email/${encodeURIComponent(sessionUser.email)}`)
            : null;

        if (!data) {
          setProfile(null);
          setLoading(false);
          return;
        }

        setProfile(data?.data || data);
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
    setForm({
      userName: profile.userName || profile.name || '',
      phoneNumber: profile.phoneNumber || profile.phone || '',
    });
    setEditing(true);
  };

  const cancelEdit = () => {
    setEditing(false);
    setForm({ userName: '', phoneNumber: '' });
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const payload = { userName: form.userName, phoneNumber: form.phoneNumber };
      const { data: updated } = await axios.put(`/users/${profile._id || profile.id}`, payload );
      setProfile(updated);
      try {
        const existing = getStoredUser();
        if (existing) {
          const nextUser = {
            ...existing,
            userName: updated.userName || existing.userName,
            email: updated.emailAddress || existing.email,
            phoneNumber: updated.phoneNumber || existing.phoneNumber,
          };
          window.sessionStorage.setItem('user', JSON.stringify(nextUser));
        }
      } catch (e) {}
      setEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const joined = profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : '—';
  const initials = (profile.userName || profile.name || 'U')
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <main className="main container profile-page">
      <section className="profile-card glassy">
        <div className="profile-hero">
          <div className="profile-avatar">{initials}</div>
          <div className="profile-title">
            <h1>{profile.userName || profile.name || 'User'}</h1>
            <div className="muted">Joined {joined}</div>
          </div>
          {profile.role && (
            <span className="badge bg-primary role-pill">
              {profile.role}
            </span>
          )}
        </div>

        <div className="profile-grid">
          <div className="profile-tile">
            <div className="label">Email</div>
            <div className="value">{profile.emailAddress || profile.email || '—'}</div>
            <div className="subtle">Login ID • not editable</div>
          </div>
          <div className="profile-tile">
            <div className="label">Contact</div>
            <div className="value">{profile.phoneNumber || 'Not set'}</div>
          </div>
          <div className="profile-tile">
            <div className="label">Created At</div>
            <div className="value">{joined}</div>
          </div>
        </div>

        {!editing && (
          <div className="profile-actions">
            <button className="btn btn-primary" onClick={startEdit}>Edit profile</button>
          </div>
        )}

        {editing && (
          <div className="row g-3 profile-form">
            <div className="col-md-6">
              <label className="form-label">Full name</label>
              <input className="form-control" value={form.userName} onChange={(e) => setForm({ ...form, userName: e.target.value })} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Phone number</label>
              <input
                className="form-control"
                value={form.phoneNumber}
                onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                placeholder="e.g., +1 555 123 4567"
              />
            </div>
            <div className="col-12 d-flex gap-2">
              <button className="btn btn-primary" onClick={saveProfile} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
              <button className="btn btn-outline-secondary" onClick={cancelEdit}>Cancel</button>
            </div>
            {error && <div className="alert alert-danger mt-2">{error}</div>}
          </div>
        )}
      </section>
    </main>
  );
};

export default UserProfile;
