const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema(
  {
    participantName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    participantEnrollmentNumber: {
      type: String,
      maxlength: 100,
    },
    participantInstituteName: {
      type: String,
      maxlength: 300,
    },
    participantCity: {
      type: String,
      maxlength: 300,
    },
    participantMobile: {
      type: String,
      maxlength: 100,
    },
    participantEmail: {
      type: String,
      maxlength: 300,
    },
    isGroupLeader: {
      type: Boolean,
      default: false,
    },
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    modifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Participant", participantSchema);
