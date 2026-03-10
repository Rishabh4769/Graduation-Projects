import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiRefreshCw,
  FiUsers,
} from 'react-icons/fi';
import axios from 'axios';
import '../../styles/Users/userDashboardPro.css';
import '../../styles/Admin/adminDashboard.modern.css';

const AdminAttendance = () => {
  const [events, setEvents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [savingId, setSavingId] = useState('');
  const [error, setError] = useState('');

  const loadEvents = useCallback(async () => {
    setLoadingEvents(true);
    setError('');

    try {
      const response = await axios.get('/events');
      const eventList = Array.isArray(response.data) ? response.data : [];
      setEvents(eventList);

      if (eventList.length > 0) {
        const firstId = eventList[0]._id || eventList[0].id;
        setSelectedEventId((prev) => prev || firstId);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load events');
    } finally {
      setLoadingEvents(false);
    }
  }, []);

  const loadGroups = useCallback(async (eventId) => {
    if (!eventId) {
      setGroups([]);
      return;
    }

    setLoadingGroups(true);
    setError('');

    try {
      const response = await axios.get(`/groups?eventId=${eventId}`);
      const groupList = Array.isArray(response.data) ? response.data : [];
      setGroups(groupList);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load groups');
    } finally {
      setLoadingGroups(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  useEffect(() => {
    if (selectedEventId) {
      loadGroups(selectedEventId);
    }
  }, [selectedEventId, loadGroups]);

  const presentCount = useMemo(() => groups.filter((g) => g.isPresent).length, [groups]);
  const absentCount = useMemo(() => groups.length - presentCount, [groups, presentCount]);

  const handleToggleAttendance = async (group) => {
    const id = group._id || group.id;
    if (!id) return;

    setSavingId(id);
    setError('');

    try {
      const response = await axios.put(`/groups/${id}`, { isPresent: !group.isPresent });
      const updated = response.data;

      setGroups((prev) => prev.map((g) => ((g._id || g.id) === id ? updated : g)));
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update attendance');
    } finally {
      setSavingId('');
    }
  };

  const handleRefresh = () => {
    if (selectedEventId) {
      loadGroups(selectedEventId);
    }
  };

  const activeEvent = events.find((ev) => (ev._id || ev.id) === selectedEventId);

  return (
    <main className="user-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Attendance</h1>
          <p>Mark group attendance for each event in real time</p>
        </div>
        <Link to="/app/admin/events" className="btn-primary-header">Events</Link>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <section className="dashboard-card full-width">
        <div className="card-header d-flex flex-wrap gap-3 align-items-center">
          <div>
            <h2>Event Filter</h2>
            <p className="text-muted mb-0">Choose an event to view and update group attendance</p>
          </div>
          <div className="ms-auto d-flex gap-2 align-items-center">
            <select
              className="form-select"
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              disabled={loadingEvents || events.length === 0}
            >
              {events.length === 0 && <option>Loading events...</option>}
              {events.map((event) => (
                <option key={event._id || event.id} value={event._id || event.id}>
                  {event.eventName || event.title || 'Untitled Event'}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={handleRefresh}
              disabled={loadingGroups || !selectedEventId}
            >
              <FiRefreshCw aria-hidden="true" /> Refresh
            </button>
          </div>
        </div>

        <div className="row g-3">
          <div className="col-md-4">
            <div className="mini-card gradient-blue">
              <div className="mini-card-icon"><FiCalendar /></div>
              <div className="mini-card-label">Event</div>
              <div className="mini-card-value">{activeEvent?.eventName || 'Select an event'}</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="mini-card gradient-green">
              <div className="mini-card-icon"><FiUsers /></div>
              <div className="mini-card-label">Total Groups</div>
              <div className="mini-card-value">{loadingGroups ? '...' : groups.length}</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="mini-card gradient-orange">
              <div className="mini-card-icon"><FiClock /></div>
              <div className="mini-card-label">Present / Absent</div>
              <div className="mini-card-value">
                {loadingGroups ? '...' : `${presentCount} / ${absentCount}`}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-card full-width">
        <div className="card-header">
          <h2>Mark Attendance</h2>
          <span className="text-muted">Toggle presence for each group</span>
        </div>

        {loadingGroups && <p className="text-muted mb-0">Loading groups...</p>}
        {!loadingGroups && groups.length === 0 && (
          <p className="text-muted mb-0">No groups found for this event.</p>
        )}

        {!loadingGroups && groups.length > 0 && (
          <div className="table-scroll-wrap">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th scope="col">Group</th>
                  <th scope="col">Payment</th>
                  <th scope="col">Attendance</th>
                  <th scope="col" className="text-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {groups.map((group) => {
                  const id = group._id || group.id;
                  return (
                    <tr key={id}>
                      <td>
                        <div className="fw-semibold">{group.groupName || 'Untitled Group'}</div>
                        <small className="text-muted">{group.eventId}</small>
                      </td>
                      <td>
                        <span className={`badge ${group.isPaymentDone ? 'bg-success' : 'bg-secondary'}`}>
                          {group.isPaymentDone ? 'Paid' : 'Pending'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${group.isPresent ? 'bg-success' : 'bg-warning text-dark'}`}>
                          {group.isPresent ? 'Present' : 'Not Marked'}
                        </span>
                      </td>
                      <td className="text-end">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light d-inline-flex align-items-center gap-2"
                          onClick={() => handleToggleAttendance(group)}
                          disabled={savingId === id}
                        >
                          {group.isPresent ? <FiCheckCircle aria-hidden="true" /> : <FiClock aria-hidden="true" />}
                          {savingId === id ? 'Saving…' : group.isPresent ? 'Mark Absent' : 'Mark Present'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
};

export default AdminAttendance;
