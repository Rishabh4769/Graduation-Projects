import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiEdit3, FiMail, FiPlus, FiShield, FiTrash2, FiUsers } from 'react-icons/fi';
import axios from 'axios';
import '../../styles/Users/userDashboardPro.css';
import '../../styles/Admin/adminDashboard.modern.css';

const AdminManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState('');
  const [form, setForm] = useState({
    userName: '',
    emailAddress: '',
    phoneNumber: '',
    role: 'student',
    userPassword: '',
    isActive: true,
  });

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    setError('');

    try {
      const response = await axios.get('/users');
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }

  const nonAdminUsers = users.filter((user) => (user.role || '').toLowerCase() !== 'admin');
  const adminCount = users.filter((user) => (user.role || '').toLowerCase() === 'admin').length;
  const activeNonAdminCount = nonAdminUsers.filter((user) => user.isActive !== false).length;

  function formatRole(role) {
    if (!role) {
      return 'student';
    }

    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  }

  function resetForm() {
    setEditingId('');
    setForm({
      userName: '',
      emailAddress: '',
      phoneNumber: '',
      role: 'student',
      userPassword: '',
      isActive: true,
    });
  }

  function startEdit(user) {
    setEditingId(user._id || user.id);
    setForm({
      userName: user.userName || '',
      emailAddress: user.emailAddress || '',
      phoneNumber: user.phoneNumber || '',
      role: (user.role || 'student').toLowerCase() === 'admin' ? 'student' : user.role || 'student',
      userPassword: '',
      isActive: user.isActive !== false,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (editingId) {
        const payload = {
          userName: form.userName,
          emailAddress: form.emailAddress,
          phoneNumber: form.phoneNumber,
          role: form.role,
          isActive: form.isActive,
        };

        if (form.userPassword) {
          payload.userPassword = form.userPassword;
        }

        await axios.put(`/users/${editingId}`, payload);
      } else {
        await axios.post('/users', {
          userName: form.userName,
          emailAddress: form.emailAddress,
          phoneNumber: form.phoneNumber,
          role: form.role,
          userPassword: form.userPassword,
        });
      }

      resetForm();
      await loadUsers();
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || err.message || 'Failed to save user');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(userId) {
    setError('');

    try {
      await axios.delete(`/users/${userId}`);
      if (editingId === userId) {
        resetForm();
      }
      await loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete user');
    }
  }

  return (
    <main className="user-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Manage Users</h1>
          <p>Review user accounts, roles, and access status</p>
        </div>
        <Link to="/app/admin/profile" className="btn-primary-header">Admin Account</Link>
      </div>

      <section className="stats-section">
        <div className="stat-card gradient-blue">
          <div className="stat-header">
            <FiUsers className="stat-icon" aria-hidden="true" />
            <span className="stat-label">Users</span>
          </div>
          <div className="stat-value">{loading ? '...' : nonAdminUsers.length}</div>
          <p className="stat-detail">{error || `${activeNonAdminCount} active non-admin users`}</p>
        </div>
        <div className="stat-card gradient-purple">
          <div className="stat-header">
            <FiShield className="stat-icon" aria-hidden="true" />
            <span className="stat-label">Admins</span>
          </div>
          <div className="stat-value">{loading ? '...' : adminCount}</div>
          <p className="stat-detail">{error || 'Users with elevated access'}</p>
        </div>
      </section>

      <section className="dashboard-card full-width">
        <div className="card-header">
          <h2>{editingId ? 'Edit User' : 'Create User'}</h2>
          {editingId ? (
            <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>Cancel Edit</button>
          ) : (
            <span className="view-all"><FiPlus /> New non-admin user</span>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label">Full name</label>
              <input
                className="form-control"
                value={form.userName}
                onChange={(event) => setForm({ ...form, userName: event.target.value })}
                required
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={form.emailAddress}
                onChange={(event) => setForm({ ...form, emailAddress: event.target.value })}
                required
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Phone</label>
              <input
                className="form-control"
                value={form.phoneNumber}
                onChange={(event) => setForm({ ...form, phoneNumber: event.target.value })}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label">Role</label>
              <select
                className="form-select"
                value={form.role}
                onChange={(event) => setForm({ ...form, role: event.target.value })}
              >
                <option value="student">Student</option>
                <option value="Coordinator">Coordinator</option>
              </select>
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">{editingId ? 'New Password (optional)' : 'Password'}</label>
              <input
                type="password"
                className="form-control"
                value={form.userPassword}
                onChange={(event) => setForm({ ...form, userPassword: event.target.value })}
                required={!editingId}
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={form.isActive ? 'active' : 'inactive'}
                onChange={(event) => setForm({ ...form, isActive: event.target.value === 'active' })}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="d-flex gap-2">
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? 'Saving...' : editingId ? 'Update User' : 'Create User'}
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
          <h2>User Directory</h2>
          <Link to="/app/admin/dashboard" className="view-all">Back to Dashboard <FiArrowRight /></Link>
        </div>
        <div className="table-container">
          {!loading && !error && nonAdminUsers.length === 0 && (
            <div className="event-item">
              <div className="event-info">
                <h4>No non-admin users found</h4>
                <div className="event-meta">
                  <span className="event-date">Only admin accounts exist right now.</span>
                </div>
              </div>
            </div>
          )}
          {loading && (
            <div className="event-item">
              <div className="event-info">
                <h4>Loading users...</h4>
              </div>
            </div>
          )}
          {error && (
            <div className="event-item">
              <div className="event-info">
                <h4>Failed to load users</h4>
                <div className="event-meta">
                  <span className="event-date">{error}</span>
                </div>
              </div>
            </div>
          )}
          {!loading && !error && nonAdminUsers.length > 0 && (
            <div className="table-scroll-wrap">
              <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {nonAdminUsers.map((user) => {
                  const userId = user._id || user.id;

                  return (
                    <tr key={userId}>
                      <td>{user.userName || 'Unnamed User'}</td>
                      <td><span className="event-date"><FiMail aria-hidden="true" /> {user.emailAddress}</span></td>
                      <td>{user.phoneNumber || '-'}</td>
                      <td>{formatRole(user.role)}</td>
                      <td>
                        <span className={`event-badge ${user.isActive === false ? 'badge-completed' : 'badge-upcoming'}`}>
                          {user.isActive === false ? 'Inactive' : 'Active'}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => startEdit(user)}
                          >
                            <FiEdit3 aria-hidden="true" /> Edit
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(userId)}
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

export default AdminManageUsers;
