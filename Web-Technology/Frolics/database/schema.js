const mongoose = require('mongoose');

// Users Schema
const userSchema = new mongoose.Schema({
  userName: { type: String, required: true, unique: true, maxlength: 100, trim: true },
  userPassword: { type: String, required: true, minlength: 6 },
  emailAddress: { type: String, required: true, unique: true, maxlength: 300, lowercase: true },
  phoneNumber: { type: String, maxlength: 50 },
  isAdmin: { type: Boolean, default: false },
  role: { type: String, enum: ['admin', 'instituteCoord', 'deptCoord', 'eventCoord', 'student'], default: 'student' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Institutes Schema
const instituteSchema = new mongoose.Schema({
  instituteName: { type: String, required: true, maxlength: 100, trim: true },
  instituteImage: { type: String, default: '' },
  instituteDescription: { type: String, maxlength: 1000 },
  instituteCoordinatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  modifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'modifiedAt' } });

// Departments Schema
const departmentSchema = new mongoose.Schema({
  departmentName: { type: String, required: true, maxlength: 100, trim: true },
  departmentImage: String,
  departmentDescription: { type: String, maxlength: 1000 },
  instituteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Institutes', required: true },
  departmentCoordinatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  modifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'modifiedAt' } });

// Events Schema
const eventSchema = new mongoose.Schema({
  eventName: { type: String, required: true, maxlength: 100 },
  eventTagline: { type: String, maxlength: 300 },
  eventImage: String,
  eventDescription: { type: String, maxlength: 1000 },
  groupMinParticipants: { type: Number, min: 1, required: true },
  groupMaxParticipants: { type: Number, min: 1, required: true },
  eventFees: { type: Number, min: 0, default: 0 },
  eventFirstPrice: { type: String, maxlength: 300 },
  eventSecondPrice: { type: String, maxlength: 300 },
  eventThirdPrice: { type: String, maxlength: 300 },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Departments', required: true },
  eventCoordinatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  eventMainStudentCoordinator: {
    name: { type: String, maxlength: 100 },
    phone: String,
    email: String
  },
  eventLocation: String,
  maxGroupsAllowed: { type: Number, min: 0, default: 0 },
  modifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'modifiedAt' } });

// Groups Schema
const groupSchema = new mongoose.Schema({
  groupName: { type: String, required: true, maxlength: 100 },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Events', required: true },
  isPaymentDone: { type: Boolean, default: false },
  isPresent: { type: Boolean, default: false },
  modifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'modifiedAt' } });

// Participants Schema
const participantSchema = new mongoose.Schema({
  participantName: { type: String, required: true, maxlength: 100 },
  participantEnrollmentNumber: { type: String, maxlength: 100 },
  participantInstituteName: { type: String, maxlength: 300 },
  participantCity: { type: String, maxlength: 300 },
  participantMobile: { type: String, maxlength: 100 },
  participantEmail: { type: String, maxlength: 300 },
  isGroupLeader: { type: Boolean, default: false },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Groups', required: true },
  modifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'modifiedAt' } });

// EventWiseWinners Schema
const winnerSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Events', required: true },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Groups', required: true },
  sequence: { type: Number, enum: [1, 2, 3], required: true },
  modifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'modifiedAt' } });

module.exports = {
  userSchema,
  instituteSchema,
  departmentSchema,
  eventSchema,
  groupSchema,
  participantSchema,
  winnerSchema
};
