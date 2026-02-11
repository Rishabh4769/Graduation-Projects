const mongoose = require("mongoose");

const instituteSchema = new mongoose.Schema(
  {
    instituteName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    instituteImage: {
      type: String,
      maxlength: 300,
    },
    instituteDescription: {
      type: String,
      maxlength: 1000,
    },
    instituteCoordinatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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

module.exports = mongoose.model("Institute", instituteSchema);
