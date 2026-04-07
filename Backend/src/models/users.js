const mongoose = require("mongoose");

module.exports = mongoose.model("User", new mongoose.Schema({
  email: { type: String, unique: true },
  phone: String,
  passwordHash: String,
  gender: String,
  Age: Number,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  role: { type: String, default: "user" },
  createdAt: { type: Date, default: Date.now }
}));
