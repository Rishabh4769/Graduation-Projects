import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiPlus, FiTrash2, FiEdit3 } from 'react-icons/fi';
import axios from 'axios';
import '../../styles/Users/userDashboardPro.css';
import '../../styles/Admin/adminDashboard.modern.css';

const AdminInstitutes = () => {
  const [institutes, setInstitutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState('');
  const [form, setForm] = useState({
    instituteName: '',
    instituteImage: '',
    instituteDescription: '',
    instituteCoordinatorId: '',
  });

  useEffect(() => {
    loadInstitutes();
  }, []);

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

  function resetForm() {
    setEditingId('');
    setForm({
      instituteName: '',
      instituteImage: '',
      instituteDescription: '',
      instituteCoordinatorId: '',
    });
  }

  function startEdit(institute) {
    setEditingId(institute._id || institute.id);
    setForm({
      instituteName: institute.instituteName || '',
      instituteImage: institute.instituteImage || '',
      instituteDescription: institute.instituteDescription || '',
      instituteCoordinatorId: institute.instituteCoordinatorId || '',
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const payload = { ...form };
      if (!payload.instituteCoordinatorId) delete payload.instituteCoordinatorId;
      if (!payload.instituteImage) delete payload.instituteImage;
      if (!payload.instituteDescription) delete payload.instituteDescription;

      if (editingId) {
        await axios.put(`/institutes/${editingId}`, payload);
      } else {
        await axios.post('/institutes', payload);
      }

      resetForm();
      await loadInstitutes();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save institute');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    setError('');
    try {
      await axios.delete(`/institutes/${id}`);
      if (editingId === id) resetForm();
      await loadInstitutes();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete institute');
    }
  }

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
          <h2>{editingId ? 'Edit Institute' : 'Create Institute'}</h2>
          {editingId ? (
            <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>Cancel Edit</button>
          ) : (
            <span className="view-all"><FiPlus /> New institute</span>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Name</label>
              <input
                className="form-control"
                value={form.instituteName}
                onChange={(e) => setForm({ ...form, instituteName: e.target.value })}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Coordinator ID</label>
              <input
                className="form-control"
                value={form.instituteCoordinatorId}
                onChange={(e) => setForm({ ...form, instituteCoordinatorId: e.target.value })}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Image URL</label>
            <input
              className="form-control"
              value={form.instituteImage}
              onChange={(e) => setForm({ ...form, instituteImage: e.target.value })}
              placeholder="https://example.com/institute.jpg"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              rows={3}
              value={form.instituteDescription}
              onChange={(e) => setForm({ ...form, instituteDescription: e.target.value })}
            />
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="d-flex gap-2">
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? 'Saving…' : editingId ? 'Update Institute' : 'Create Institute'}
            </button>
            {editingId && (
              <button className="btn btn-outline-secondary" type="button" onClick={resetForm}>
                Reset
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="dashboard-card full-width">
        <div className="card-header">
          <h2>Institute Directory</h2>
          <Link to="/app/admin/winners" className="view-all">Winner Records <FiArrowRight /></Link>
        </div>
        <div className="table-container">
          {loading && (
            <div className="event-item">
              <div className="event-info">
                <h4>Loading institutes...</h4>
              </div>
            </div>
          )}
          {error && (
            <div className="event-item">
              <div className="event-info">
                <h4>Failed to load institutes</h4>
                <p>{error}</p>
              </div>
            </div>
          )}
          {!loading && !error && institutes.length === 0 && (
            <div className="event-item">
              <div className="event-info">
                <h4>No institutes found</h4>
                <p>The database returned an empty institute list.</p>
              </div>
            </div>
          )}
          {!loading && !error && institutes.length > 0 && (
            <div className="table-scroll-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Coordinator</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {institutes.map((institute) => {
                    const id = institute._id || institute.id;
                    return (
                      <tr key={id}>
                        <td>{institute.instituteName || 'Unnamed Institute'}</td>
                        <td>{institute.instituteDescription || '—'}</td>
                        <td>{institute.instituteCoordinatorId || '—'}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => startEdit(institute)}
                            >
                              <FiEdit3 aria-hidden="true" /> Edit
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(id)}
                            >
                              <FiTrash2 aria-hidden="true" /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default AdminInstitutes;
