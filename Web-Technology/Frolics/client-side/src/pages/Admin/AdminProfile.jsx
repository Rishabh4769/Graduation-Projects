import React from 'react';
import '../../styles/Users/partials/globals.css';
import '../../styles/Users/partials/layout.css';

const AdminProfile = () => {
  // placeholder: admin profile view
  return (
    <main className="main container">
      <h1>Admin Profile</h1>
      <div className="event-card" style={{ marginTop: 16 }}>
        <h3 className="event-name">Darshan University Admin</h3>
        <p className="meta-item">Email: admin@example.com</p>
      </div>
    </main>
  );
};

export default AdminProfile;
