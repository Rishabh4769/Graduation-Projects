import React from 'react';
import { FiHome, FiWifi, FiShield, FiMapPin, FiPhoneCall, FiTool } from 'react-icons/fi';
import '../../../styles/Users/userDashboardPro.css';

const facilities = [
  { icon: <FiWifi />, title: 'Connectivity', detail: 'High-speed Wi‑Fi in rooms, study halls, and common areas.' },
  { icon: <FiShield />, title: 'Security', detail: '24/7 security staff, CCTV, gated access, visitor logging.' },
  { icon: <FiHome />, title: 'Living Spaces', detail: 'Clean rooms, common lounges, study desks, and lockers.' },
  { icon: <FiTool />, title: 'Maintenance', detail: 'Daily housekeeping in common areas; on-demand room fixes.' },
];

const Hostel = () => {
  return (
    <main className="user-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Hostel Facilities</h1>
          <p>Everything you need to know about on-campus stay during Frolics.</p>
        </div>
      </div>

      <section className="dashboard-card full-width">
        <div className="card-header">
          <h2><FiHome aria-hidden="true" /> Overview</h2>
        </div>
        <div className="dashboard-grid">
          {facilities.map((f) => (
            <article key={f.title} className="policy-card shadow-sm">
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="badge bg-gradient-primary text-white">{f.icon}</span>
                <h4 className="mb-0">{f.title}</h4>
              </div>
              <p className="mb-0 text-muted">{f.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="dashboard-card full-width">
        <div className="card-header">
          <h2><FiMapPin aria-hidden="true" /> Check-in & Support</h2>
        </div>
        <div className="row g-3">
          <div className="col-md-6">
            <article className="policy-card shadow-sm h-100">
              <h4>Arrival & Allotment</h4>
              <ul className="mb-0">
                <li>Check-in opens 8 AM on event days; carry your ID and fee receipt.</li>
                <li>Room allotment is handled at the hostel helpdesk near Gate 2.</li>
                <li>Quiet hours: 11 PM – 6 AM. Keep corridors clear after 10 PM.</li>
              </ul>
            </article>
          </div>
          <div className="col-md-6">
            <article className="policy-card shadow-sm h-100">
              <h4>Contact & Escalation</h4>
              <ul className="mb-2">
                <li>Helpdesk: <FiPhoneCall aria-hidden="true" /> +91-98765-12345 (24x7)</li>
                <li>Email: hostel-support@frolics.edu</li>
                <li>Maintenance tickets can be logged from your profile > Hostel section.</li>
              </ul>
              <p className="mb-0 text-muted">In emergencies, reach security at the ground floor desk immediately.</p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Hostel;
