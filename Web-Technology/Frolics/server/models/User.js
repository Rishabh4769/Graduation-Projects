const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    emailAddress: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 300,
    },
    phoneNumber: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    userPassword: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 300,
    },
    role: {
      type: String,
      enum: [
        "admin",
        "Coordinator",
        "student",
      ],
      default: "student",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
