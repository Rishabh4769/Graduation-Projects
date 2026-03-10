import React from 'react';
import { FiCheckCircle, FiAlertTriangle, FiClock, FiShield, FiUsers, FiFileText } from 'react-icons/fi';
import '../../../styles/Users/userDashboardPro.css';

const rules = [
  {
    title: 'Participation',
    icon: <FiUsers />,
    items: [
      'Register for events before the deadline and keep your confirmation email handy.',
      'Carry a valid student ID or government ID to every event venue.',
      'Arrive 15 minutes before reporting time to avoid late entry.',
    ],
  },
  {
    title: 'Fair Play',
    icon: <FiShield />,
    items: [
      'No plagiarism, cheating, or use of unauthorized material or devices.',
      'Follow instructions from coordinators and volunteers at all times.',
      'Respect queues, equipment, and property at the venue.',
    ],
  },
  {
    title: 'Conduct',
    icon: <FiCheckCircle />,
    items: [
      'Maintain respectful behaviour toward participants, staff, and judges.',
      'Offensive language or harassment of any kind will lead to disqualification.',
      'Keep noise levels low around active event areas.',
    ],
  },
  {
    title: 'Reporting Issues',
    icon: <FiAlertTriangle />,
    items: [
      'Report conflicts or safety concerns to the nearest coordinator immediately.',
      'Use the helpdesk desk / helpline number printed on your badge for escalation.',
    ],
  },
  {
    title: 'Timing',
    icon: <FiClock />,
    items: [
      'Stick to event timelines; late submissions may not be evaluated.',
      'Check the event page for updated schedules and room numbers before leaving.',
    ],
  },
];

const Rules = () => {
  return (
    <main className="user-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Rules & Regulations</h1>
          <p>Quick reference for participation, fairness, safety, and conduct.</p>
        </div>
      </div>

      <section className="dashboard-card full-width">
        <div className="card-header">
          <h2><FiFileText aria-hidden="true" /> Guidelines</h2>
        </div>
        <div className="dashboard-grid">
          {rules.map((rule) => (
            <article key={rule.title} className="policy-card shadow-sm">
              <div className="d-flex align-items-center gap-2 mb-3">
                <span className="badge bg-gradient-primary text-white">{rule.icon}</span>
                <h4 className="mb-0">{rule.title}</h4>
              </div>
              <ul className="mb-0">
                {rule.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Rules;
