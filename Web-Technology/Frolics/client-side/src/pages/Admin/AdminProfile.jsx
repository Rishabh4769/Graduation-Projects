import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiShield, FiUser } from 'react-icons/fi';
import '../../styles/Users/userDashboardPro.css';

const AdminProfile = () => {
  return (
    <main className="user-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Admin Account</h1>
          <p>View and manage your administrator identity</p>
        </div>
        <Link to="/app/admin/manage-users" className="btn-primary-header">Manage Users</Link>
      </div>

      <section className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Profile Summary</h2>
          </div>
          <div className="groups-list">
            <div className="group-item">
              <div className="group-avatar"><FiUser aria-hidden="true" /></div>
              <div className="group-info">
                <h4>Darshan University Admin</h4>
                <p>Primary platform administrator</p>
              </div>
            </div>
            <div className="group-item">
              <div className="group-avatar"><FiMail aria-hidden="true" /></div>
              <div className="group-info">
                <h4>admin@example.com</h4>
                <p>Official admin contact</p>
              </div>
            </div>
            <div className="group-item">
              <div className="group-avatar"><FiShield aria-hidden="true" /></div>
              <div className="group-info">
                <h4>Role: Admin</h4>
                <p>Full dashboard access enabled</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AdminProfile;
