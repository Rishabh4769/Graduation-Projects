const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { userSchema, /* import others */ } = require('./schema');

// Create models
const User = mongoose.model('User', userSchema, 'Users');
const Institute = mongoose.model('Institute', instituteSchema);
const Department = mongoose.model('Department', departmentSchema);
const Event = mongoose.model('Event', eventSchema);
const Group = mongoose.model('Group', groupSchema);
const Participant = mongoose.model('Participant', participantSchema);
const Winner = mongoose.model('Winner', winnerSchema);


// Global pre-save hooks (bcrypt, etc.)
userSchema.pre('save', async function(next) { /* bcrypt logic */ });

// Indexes
userSchema.index({ userName: 1 });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB Connected');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;
module.exports.User = User;
module.exports.Institute = Institute;
module.exports.Department = Department;
module.exports.Event = Event;
module.exports.Group = Group;
module.exports.Participant = Participant;
module.exports.Winner = Winner;