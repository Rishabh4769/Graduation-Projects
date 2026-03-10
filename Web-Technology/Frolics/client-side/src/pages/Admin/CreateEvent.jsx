import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../../styles/Admin/adminEventForm.css';
import '../../styles/Users/userDashboardPro.css';

const CreateEvent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [form, setForm] = useState({
    eventName: '',
    eventTagline: '',
    eventImage: '',
    eventDescription: '',
    eventDate: '',
    eventStatus: 'upcoming',
    groupMinParticipants: 1,
    groupMaxParticipants: 1,
    eventFees: 0,
    eventFirstPrize: '',
    eventSecondPrize: '',
    eventThirdPrize: '',
    eventCoordinatorId: '',
    eventMainStudentCoordinatorName: '',
    eventMainStudentCoordinatorPhone: '',
    eventLocation: '',
    maxGroupsAllowed: 50,
    departmentId: '',
  });

  const [departments, setDepartments] = useState([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(true);
  const [eventLoading, setEventLoading] = useState(isEditMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadDepartments() {
      setDepartmentsLoading(true);

      try {
        const response = await axios.get('/departments');
        const departmentList = Array.isArray(response.data) ? response.data : [];
        setDepartments(departmentList);
        setForm((currentForm) => ({
          ...currentForm,
          departmentId: currentForm.departmentId || departmentList[0]?._id || '',
        }));
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load departments');
      } finally {
        setDepartmentsLoading(false);
      }
    }

    loadDepartments();
  }, []);

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    async function loadEvent() {
      setEventLoading(true);

      try {
        const response = await axios.get(`/events/${id}`);
        const event = response.data;

        setForm((currentForm) => ({
          ...currentForm,
          eventName: event?.eventName || '',
          eventTagline: event?.eventTagline || '',
          eventImage: event?.eventImage || '',
          eventDescription: event?.eventDescription || '',
          eventDate: event?.eventDate ? new Date(event.eventDate).toISOString().slice(0, 10) : '',
          eventStatus: event?.eventStatus || 'upcoming',
          groupMinParticipants: event?.groupMinParticipants ?? 1,
          groupMaxParticipants: event?.groupMaxParticipants ?? 1,
          eventFees: event?.eventFees ?? 0,
          eventFirstPrize: event?.eventFirstPrize || '',
          eventSecondPrize: event?.eventSecondPrize || '',
          eventThirdPrize: event?.eventThirdPrize || '',
          eventCoordinatorId: event?.eventCoordinatorId || '',
          eventMainStudentCoordinatorName: event?.eventMainStudentCoordinatorName || '',
          eventMainStudentCoordinatorPhone: event?.eventMainStudentCoordinatorPhone || '',
          eventLocation: event?.eventLocation || '',
          maxGroupsAllowed: event?.maxGroupsAllowed ?? 50,
          departmentId: event?.departmentId || currentForm.departmentId,
        }));
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load event');
      } finally {
        setEventLoading(false);
      }
    }

    loadEvent();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = {
        eventName: form.eventName,
        eventTagline: form.eventTagline,
        eventImage: form.eventImage,
        eventDescription: form.eventDescription,
        eventDate: form.eventDate || undefined,
        eventStatus: form.eventStatus,
        groupMinParticipants: Number(form.groupMinParticipants),
        groupMaxParticipants: Number(form.groupMaxParticipants),
        eventFees: Number(form.eventFees),
        eventFirstPrize: form.eventFirstPrize,
        eventSecondPrize: form.eventSecondPrize,
        eventThirdPrize: form.eventThirdPrize,
        departmentId: form.departmentId,
        eventCoordinatorId: form.eventCoordinatorId || undefined,
        eventMainStudentCoordinatorName: form.eventMainStudentCoordinatorName,
        eventMainStudentCoordinatorPhone: form.eventMainStudentCoordinatorPhone,
        eventLocation: form.eventLocation,
        maxGroupsAllowed: Number(form.maxGroupsAllowed),
      };

      if (isEditMode) {
        await axios.put(`/events/${id}`, payload);
      } else {
        await axios.post('/events', payload);
      }

      navigate('/app/admin/events');
    } catch (err) {
      const errorMessage = err.response?.data?.message 
        || err.response?.data?.error 
        || err.message
        || `Failed to ${isEditMode ? 'update' : 'create'} event`;

      setError(errorMessage);
      console.error(`Event ${isEditMode ? 'update' : 'creation'} failed:`, err);
    } finally {
      setLoading(false);
    }
  };

  if (eventLoading) {
    return <main className="user-dashboard"><div className="dashboard-card"><h2>Loading event...</h2></div></main>;
  }

  return (
    <main className="user-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>{isEditMode ? 'Edit Event' : 'Create Event'}</h1>
          <p>{isEditMode ? 'Update event details and publishing state' : 'Publish a new Frolics event with participation and prize details'}</p>
        </div>
        <Link to="/app/admin/events" className="btn-primary-header">Back to Events</Link>
      </div>

      <div className="dashboard-card full-width" style={{ maxWidth: 900 }}>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Event name</label>
              <input
                name="eventName"
                className="form-control"
                value={form.eventName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Department</label>
              <select
                name="departmentId"
                className="form-control"
                value={form.departmentId}
                onChange={handleChange}
                disabled={departmentsLoading || departments.length === 0}
                required
              >
                {departments.length === 0 && <option value="">No departments available</option>}
                {departments.map((department) => (
                  <option key={department._id} value={department._id}>
                    {department.departmentName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Tagline</label>
            <input
              name="eventTagline"
              className="form-control"
              value={form.eventTagline}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Event image URL</label>
            <input
              name="eventImage"
              className="form-control"
              value={form.eventImage}
              onChange={handleChange}
              placeholder="https://example.com/event-banner.jpg"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              name="eventDescription"
              className="form-control"
              rows={4}
              value={form.eventDescription}
              onChange={handleChange}
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Event date</label>
              <input
                type="date"
                name="eventDate"
                className="form-control"
                value={form.eventDate}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Event status</label>
              <select
                name="eventStatus"
                className="form-select"
                value={form.eventStatus}
                onChange={handleChange}
              >
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label">Coordinator ID</label>
              <input
                name="eventCoordinatorId"
                className="form-control"
                value={form.eventCoordinatorId}
                onChange={handleChange}
                placeholder="Mongo user id"
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Main student coordinator</label>
              <input
                name="eventMainStudentCoordinatorName"
                className="form-control"
                value={form.eventMainStudentCoordinatorName}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Coordinator phone</label>
              <input
                name="eventMainStudentCoordinatorPhone"
                className="form-control"
                value={form.eventMainStudentCoordinatorPhone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label">Min participants per group</label>
              <input
                type="number"
                name="groupMinParticipants"
                className="form-control"
                value={form.groupMinParticipants}
                onChange={handleChange}
                min="1"
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Max participants per group</label>
              <input
                type="number"
                name="groupMaxParticipants"
                className="form-control"
                value={form.groupMaxParticipants}
                onChange={handleChange}
                min="1"
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Fees (₹)</label>
              <input
                type="number"
                name="eventFees"
                className="form-control"
                value={form.eventFees}
                onChange={handleChange}
                min="0"
                step="1"
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label">First prize</label>
              <input
                name="eventFirstPrize"
                className="form-control"
                value={form.eventFirstPrize}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Second prize</label>
              <input
                name="eventSecondPrize"
                className="form-control"
                value={form.eventSecondPrize}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Third prize</label>
              <input
                name="eventThirdPrize"
                className="form-control"
                value={form.eventThirdPrize}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Location</label>
            <input
              name="eventLocation"
              className="form-control"
              value={form.eventLocation}
              onChange={handleChange}
            />
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="d-flex gap-2">
            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Saving…' : isEditMode ? 'Update Event' : 'Create Event'}
            </button>
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default CreateEvent;
