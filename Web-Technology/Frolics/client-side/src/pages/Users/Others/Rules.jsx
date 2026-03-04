import React from 'react';
import '../../../styles/Users/partials/globals.css';
import '../../../styles/Users/partials/layout.css';

const Rules = () => {
  return (
    <main className="main container">
      <h1>General Rules & Regulations</h1>
      <p className="lead text-muted">Please follow these guidelines to ensure fair play and a smooth experience for everyone.</p>

      <section className="policy-card">
        <h3>Participation</h3>
        <ul>
          <li>Register for events before the deadline.</li>
          <li>Follow event-specific rules provided by organisers.</li>
          <li>Maintain respectful behaviour towards participants and staff.</li>
        </ul>
      </section>

      <section className="policy-card">
        <h3>Code of Conduct</h3>
        <ul>
          <li>No cheating, plagiarism, or unfair assistance.</li>
          <li>Report any issues to event moderators immediately.</li>
        </ul>
      </section>
    </main>
  );
};

export default Rules;
