const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  otp: {
    type: String,
    required: true
  },
  attempts: {
    type: Number,
    default: 0
  },
  expires: {
    type: Date,
    required: true
  },
  role:String
});

module.exports = mongoose.model("OTP", otpSchema);