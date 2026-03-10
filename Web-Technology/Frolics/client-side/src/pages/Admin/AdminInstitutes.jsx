import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiHome, FiMapPin } from 'react-icons/fi';
import axios from 'axios';
import '../../styles/Users/userDashboardPro.css';

const AdminInstitutes = () => {
  const [institutes, setInstitutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadInstitutes() {
      setLoading(true);
      setError('');

      try {
        const response = await axios.get('/institutes');
        setInstitutes(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load institutes');
      } finally {
        setLoading(false);
      }
    }

    loadInstitutes();
  }, []);

  return (
    <main className="user-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Manage Institutes</h1>
          <p>Track participating institutes and their campus details</p>
        </div>
        <Link to="/app/admin/dashboard" className="btn-primary-header">Dashboard</Link>
      </div>

      <section className="dashboard-card full-width">
        <div className="card-header">
          <h2>Institute Directory</h2>
          <Link to="/app/admin/winners" className="view-all">Winner Records <FiArrowRight /></Link>
        </div>
        <div className="groups-list">
          {loading && (
            <div className="group-item">
              <div className="group-info">
                <h4>Loading institutes...</h4>
              </div>
            </div>
          )}
          {error && (
            <div className="group-item">
              <div className="group-info">
                <h4>Failed to load institutes</h4>
                <p>{error}</p>
              </div>
            </div>
          )}
          {!loading && !error && institutes.length === 0 && (
            <div className="group-item">
              <div className="group-info">
                <h4>No institutes found</h4>
                <p>The database returned an empty institute list.</p>
              </div>
            </div>
          )}
          {institutes.map((institute) => (
            <div key={institute._id || institute.id} className="group-item">
              <div className="group-avatar"><FiHome aria-hidden="true" /></div>
              <div className="group-info">
                <h4>{institute.instituteName || 'Unnamed Institute'}</h4>
                <p>
                  <FiMapPin aria-hidden="true" /> {institute.instituteDescription || 'No description available'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default AdminInstitutes;
