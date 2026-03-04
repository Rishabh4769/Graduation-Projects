import React from 'react';
import '../../../styles/Users/partials/globals.css';
import '../../../styles/Users/partials/layout.css';

const Hostel = () => {
  return (
    <main className="main container">
      <h1>Hostel Facilities</h1>
      <p className="lead text-muted">Overview of on-campus hostel facilities and services available to students.</p>

      <section className="policy-card">
        <h3>Facilities</h3>
        <ul>
          <li>24/7 security and CCTV monitored entry.</li>
          <li>Mess and cafeteria with weekly menus.</li>
          <li>Common rooms, study areas and recreational spaces.</li>
        </ul>
      </section>

      <section className="policy-card">
        <h3>Reporting & Support</h3>
        <p>For maintenance requests or complaints, contact hostel administration via the portal or the helpdesk.</p>
      </section>
    </main>
  );
};

export default Hostel;
