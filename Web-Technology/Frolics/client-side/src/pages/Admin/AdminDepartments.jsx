import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiEdit3, FiFileText, FiPlus, FiTrash2 } from 'react-icons/fi';
import axios from 'axios';
import '../../styles/Users/userDashboardPro.css';
import '../../styles/Admin/adminDashboard.modern.css';

const AdminDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState('');
  const [form, setForm] = useState({
    departmentName: '',
    departmentImage: '',
    departmentDescription: '',
    instituteId: '',
    departmentCoordinatorId: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError('');

    try {
      const [departmentsResponse, institutesResponse] = await Promise.all([
        axios.get('/departments'),
        axios.get('/institutes'),
      ]);

      const departmentList = Array.isArray(departmentsResponse.data) ? departmentsResponse.data : [];
      const instituteList = Array.isArray(institutesResponse.data) ? institutesResponse.data : [];

      setDepartments(departmentList);
      setInstitutes(instituteList);
      setForm((currentForm) => ({
        ...currentForm,
        instituteId: currentForm.instituteId || instituteList[0]?._id || '',
      }));
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load departments');
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setEditingId('');
    setForm({
      departmentName: '',
      departmentImage: '',
      departmentDescription: '',
      instituteId: institutes[0]?._id || '',
      departmentCoordinatorId: '',
    });
  }

  function startEdit(department) {
    setEditingId(department._id || department.id);
    setForm({
      departmentName: department.departmentName || '',
      departmentImage: department.departmentImage || '',
      departmentDescription: department.departmentDescription || '',
      instituteId: department.instituteId || '',
      departmentCoordinatorId: department.departmentCoordinatorId || '',
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (editingId) {
        await axios.put(`/departments/${editingId}`, form);
      } else {
        await axios.post('/departments', form);
      }

      resetForm();
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save department');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(departmentId) {
    setError('');

    try {
      await axios.delete(`/departments/${departmentId}`);
      if (editingId === departmentId) {
        resetForm();
      }
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete department');
    }
  }

  const instituteNameById = new Map(
    institutes.map((institute) => [String(institute._id || institute.id), institute.instituteName || 'Unknown Institute'])
  );

  return (
    <main className="user-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Manage Departments</h1>
          <p>Create, edit, and delete department records from the admin area</p>
        </div>
        <Link to="/app/admin/dashboard" className="btn-primary-header">Dashboard</Link>
      </div>

      <section className="stats-section">
        <div className="stat-card gradient-blue">
          <div className="stat-header">
            <FiFileText className="stat-icon" aria-hidden="true" />
            <span className="stat-label">Departments</span>
          </div>
          <div className="stat-value">{loading ? '...' : departments.length}</div>
          <p className="stat-detail">{error || 'Department records in the database'}</p>
        </div>
      </section>

      <section className="dashboard-card full-width">
        <div className="card-header">
          <h2>{editingId ? 'Edit Department' : 'Create Department'}</h2>
          {editingId ? (
            <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>Cancel Edit</button>
          ) : (
            <span className="view-all"><FiPlus /> New department</span>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Department name</label>
              <input
                className="form-control"
                value={form.departmentName}
                onChange={(event) => setForm({ ...form, departmentName: event.target.value })}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Institute</label>
              <select
                className="form-select"
                value={form.instituteId}
                onChange={(event) => setForm({ ...form, instituteId: event.target.value })}
                required
              >
                {institutes.length === 0 && <option value="">No institutes available</option>}
                {institutes.map((institute) => (
                  <option key={institute._id || institute.id} value={institute._id || institute.id}>
                    {institute.instituteName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Image URL</label>
              <input
                className="form-control"
                value={form.departmentImage}
                onChange={(event) => setForm({ ...form, departmentImage: event.target.value })}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Coordinator ID</label>
              <input
                className="form-control"
                value={form.departmentCoordinatorId}
                onChange={(event) => setForm({ ...form, departmentCoordinatorId: event.target.value })}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              rows={4}
              value={form.departmentDescription}
              onChange={(event) => setForm({ ...form, departmentDescription: event.target.value })}
            />
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="d-flex gap-2">
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? 'Saving...' : editingId ? 'Update Department' : 'Create Department'}
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
          <h2>Department Directory</h2>
          <Link to="/app/admin/events" className="view-all">Event Overview <FiArrowRight /></Link>
        </div>
        <div className="table-container">
          {loading && (
            <div className="event-item">
              <div className="event-info">
                <h4>Loading departments...</h4>
              </div>
            </div>
          )}
          {error && (
            <div className="event-item">
              <div className="event-info">
                <h4>Failed to load departments</h4>
                <div className="event-meta">
                  <span className="event-date">{error}</span>
                </div>
              </div>
            </div>
          )}
          {!loading && !error && departments.length === 0 && (
            <div className="event-item">
              <div className="event-info">
                <h4>No departments found</h4>
              </div>
            </div>
          )}
          {!loading && !error && departments.length > 0 && (
            <div className="table-scroll-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Institute</th>
                    <th>Coordinator ID</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map((department) => {
                    const departmentId = department._id || department.id;
                    return (
                      <tr key={departmentId}>
                        <td>{department.departmentName}</td>
                        <td>{instituteNameById.get(String(department.instituteId)) || 'Unknown Institute'}</td>
                        <td>{department.departmentCoordinatorId || '-'}</td>
                        <td>{department.departmentDescription || '-'}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => startEdit(department)}
                            >
                              <FiEdit3 aria-hidden="true" /> Edit
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(departmentId)}
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

export default AdminDepartments;
