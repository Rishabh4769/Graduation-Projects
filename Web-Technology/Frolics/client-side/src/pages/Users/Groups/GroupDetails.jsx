import React, { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiArrowLeft, FiCalendar, FiCreditCard, FiMapPin, FiUser, FiUsers } from 'react-icons/fi';
import axios from 'axios';
import '../../../styles/Users/userDashboardPro.css';

const GroupDetails = () => {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingParticipant, setSavingParticipant] = useState(false);
  const [participantForm, setParticipantForm] = useState({
    participantName: '',
    participantEnrollmentNumber: '',
    participantInstituteName: '',
    participantCity: '',
    participantMobile: '',
    participantEmail: '',
    isGroupLeader: false,
  });

  const loadGroupData = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const groupResponse = await axios.get(`/groups/${id}`);
      const groupData = groupResponse.data;
      setGroup(groupData);

      const requests = [axios.get('/participants')];
      if (groupData?.eventId) {
        requests.push(axios.get(`/events/${groupData.eventId}`));
      }

      const [participantsResponse, eventResponse] = await Promise.all(requests);
      const allParticipants = Array.isArray(participantsResponse.data) ? participantsResponse.data : [];

      setParticipants(
        allParticipants.filter((participant) => String(participant.groupId) === String(groupData?._id || groupData?.id))
      );
      setEvent(eventResponse?.data || null);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load group details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadGroupData();
  }, [loadGroupData]);

  async function handleParticipantSubmit(eventObject) {
    eventObject.preventDefault();
    setSavingParticipant(true);
    setError('');

    try {
      const rawUser = localStorage.getItem('user');
      const currentUser = rawUser ? JSON.parse(rawUser) : null;

      await axios.post('/participants', {
        ...participantForm,
        groupId: group._id || group.id,
        createdBy: currentUser?.id || currentUser?._id,
        modifiedBy: currentUser?.id || currentUser?._id,
      });

      setParticipantForm({
        participantName: '',
        participantEnrollmentNumber: '',
        participantInstituteName: '',
        participantCity: '',
        participantMobile: '',
        participantEmail: '',
        isGroupLeader: false,
      });

      await loadGroupData();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to add participant');
    } finally {
      setSavingParticipant(false);
    }
  }

  if (loading) {
    return <main className="user-dashboard"><div className="dashboard-card"><h2>Loading group...</h2></div></main>;
  }

  if (error) {
    return (
      <main className="user-dashboard">
        <div className="dashboard-card">
          <h2>Failed to load group</h2>
          <p className="stat-detail">{error}</p>
          <Link to="/app/groups" className="view-all"><FiArrowLeft /> Back to My Groups</Link>
        </div>
      </main>
    );
  }

  if (!group) {
    return (
      <main className="user-dashboard">
        <div className="dashboard-card">
          <h2>Group not found</h2>
          <Link to="/app/groups" className="view-all"><FiArrowLeft /> Back to My Groups</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="user-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>{group.groupName || 'Group Details'}</h1>
          <p>View the selected group, its event, and participant list</p>
        </div>
        <Link to="/app/groups" className="btn-primary-header">Back to My Groups</Link>
      </div>

      <section className="stats-section">
        <div className="stat-card gradient-blue">
          <div className="stat-header">
            <FiUsers className="stat-icon" aria-hidden="true" />
            <span className="stat-label">Participants</span>
          </div>
          <div className="stat-value">{participants.length}</div>
          <p className="stat-detail">Members currently linked to this group</p>
        </div>
        <div className="stat-card gradient-purple">
          <div className="stat-header">
            <FiCreditCard className="stat-icon" aria-hidden="true" />
            <span className="stat-label">Payment</span>
          </div>
          <div className="stat-value">{group.isPaymentDone ? 'Done' : 'Pending'}</div>
          <p className="stat-detail">Payment status for this group</p>
        </div>
      </section>

      <div className="dashboard-grid">
        <section className="dashboard-card">
          <div className="card-header">
            <h2>Group Summary</h2>
          </div>
          <div className="groups-list">
            <div className="group-item">
              <div className="group-avatar"><FiUsers aria-hidden="true" /></div>
              <div className="group-info">
                <h4>{group.groupName}</h4>
                <p>Group ID: {group._id || group.id}</p>
              </div>
            </div>
            <div className="group-item">
              <div className="group-avatar"><FiCreditCard aria-hidden="true" /></div>
              <div className="group-info">
                <h4>{group.isPaymentDone ? 'Payment Complete' : 'Payment Pending'}</h4>
                <p>{group.isPresent ? 'Marked present' : 'Attendance not marked'}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="dashboard-card">
          <div className="card-header">
            <h2>Event Details</h2>
          </div>
          {event ? (
            <div className="groups-list">
              <div className="group-item">
                <div className="group-avatar"><FiCalendar aria-hidden="true" /></div>
                <div className="group-info">
                  <h4>{event.eventName}</h4>
                  <p>{event.eventTagline || 'No tagline available'}</p>
                </div>
              </div>
              <div className="group-item">
                <div className="group-avatar"><FiMapPin aria-hidden="true" /></div>
                <div className="group-info">
                  <h4>{event.eventLocation || 'Location not set'}</h4>
                  <p>Fee: Rs. {event.eventFees ?? 0}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="stat-detail">No linked event details available.</p>
          )}
        </section>
      </div>

      <section className="dashboard-card full-width">
        <div className="card-header">
          <h2>Participants</h2>
        </div>

        <form onSubmit={handleParticipantSubmit} style={{ marginBottom: '1.5rem' }}>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label">Participant name</label>
              <input
                className="form-control"
                value={participantForm.participantName}
                onChange={(eventObject) => setParticipantForm({ ...participantForm, participantName: eventObject.target.value })}
                required
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Enrollment number</label>
              <input
                className="form-control"
                value={participantForm.participantEnrollmentNumber}
                onChange={(eventObject) => setParticipantForm({ ...participantForm, participantEnrollmentNumber: eventObject.target.value })}
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Institute</label>
              <input
                className="form-control"
                value={participantForm.participantInstituteName}
                onChange={(eventObject) => setParticipantForm({ ...participantForm, participantInstituteName: eventObject.target.value })}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label">City</label>
              <input
                className="form-control"
                value={participantForm.participantCity}
                onChange={(eventObject) => setParticipantForm({ ...participantForm, participantCity: eventObject.target.value })}
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Mobile</label>
              <input
                className="form-control"
                value={participantForm.participantMobile}
                onChange={(eventObject) => setParticipantForm({ ...participantForm, participantMobile: eventObject.target.value })}
              />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={participantForm.participantEmail}
                onChange={(eventObject) => setParticipantForm({ ...participantForm, participantEmail: eventObject.target.value })}
              />
            </div>
          </div>

          <div className="d-flex align-items-center gap-3 mb-3">
            <input
              id="isGroupLeader"
              type="checkbox"
              checked={participantForm.isGroupLeader}
              onChange={(eventObject) => setParticipantForm({ ...participantForm, isGroupLeader: eventObject.target.checked })}
            />
            <label htmlFor="isGroupLeader" className="form-label mb-0">Mark as group leader</label>
          </div>

          <div className="d-flex gap-2">
            <button className="btn btn-primary" type="submit" disabled={savingParticipant}>
              {savingParticipant ? 'Adding...' : 'Add Participant'}
            </button>
          </div>
        </form>

        <div className="events-list">
          {participants.length === 0 && (
            <div className="event-item">
              <div className="event-info">
                <h4>No participants yet</h4>
                <div className="event-meta">
                  <span className="event-date">This group does not have participant records yet.</span>
                </div>
              </div>
            </div>
          )}
          {participants.map((participant) => (
            <div key={participant._id || participant.id} className="event-item">
              <div className="event-info">
                <h4>{participant.participantName}</h4>
                <div className="event-meta">
                  <span className="event-date"><FiUser aria-hidden="true" /> {participant.participantEmail || 'No email'}</span>
                  <span className={`event-badge ${participant.isGroupLeader ? 'badge-live' : 'badge-upcoming'}`}>
                    {participant.isGroupLeader ? 'Leader' : 'Member'}
                  </span>
                </div>
              </div>
              <span className="event-category">{participant.participantInstituteName || 'Unknown Institute'}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default GroupDetails;
