const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    eventTagline: {
      type: String,
      maxlength: 300,
    },
    eventImage: {
      type: String,
      maxlength: 300,
    },
    eventDescription: {
      type: String,
      maxlength: 1000,
    },
    eventDate: {
      type: Date,
    },
    eventStatus: {
      type: String,
      enum: ["upcoming", "ongoing", "completed"],
      default: "upcoming",
    },
    groupMinParticipants: {
      type: Number,
      required: true,
    },
    groupMaxParticipants: {
      type: Number,
      required: true,
    },
    eventFees: {
      type: Number,
      default: 0,
    },
    eventFirstPrize: {
      type: String,
      maxlength: 300,
    },
    eventSecondPrize: {
      type: String,
      maxlength: 300,
    },
    eventThirdPrize: {
      type: String,
      maxlength: 300,
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    eventCoordinatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    eventMainStudentCoordinatorName: {
      type: String,
      maxlength: 100,
    },
    eventMainStudentCoordinatorPhone: {
      type: String,
      maxlength: 100,
    },
    eventMainStudentCoordinatorEmail: {
      type: String,
      maxlength: 300,
    },
    eventLocation: {
      type: String,
      maxlength: 100,
    },
    maxGroupsAllowed: {
      type: Number,
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

module.exports = mongoose.model("Event", eventSchema);
