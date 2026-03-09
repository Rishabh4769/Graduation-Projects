import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../../../styles/Users/partials/globals.css';
import '../../../styles/Users/partials/layout.css';

const MyGroups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const all = await axios.get('/groups');
        const raw = localStorage.getItem('user');
        const me = raw ? JSON.parse(raw) : null;
        const mine = all.filter(g => (g.createdBy && (g.createdBy === me?.id || g.createdBy === me?._id)));
        setGroups(mine);
      } catch (err) {
        setGroups([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <main className="main container">Loading groups…</main>;

  return (
    <main className="main container">
      <h1>My Groups</h1>
      <div className="event-card">
        {groups.length === 0 ? (
          <p className="text-muted">You haven't created any groups yet. <Link to="/app/groups/create">Create one</Link>.</p>
        ) : (
          <ul className="list-group">
            {groups.map(g => (
              <li key={g._id || g.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>{g.groupName}</strong>
                  <div className="text-muted small">Event: {g.eventId || '—'}</div>
                </div>
                <div>
                  <Link className="btn btn-sm btn-outline-primary" to={`/app/groups/${g._id || g.id}`}>View</Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
};

export default MyGroups;
