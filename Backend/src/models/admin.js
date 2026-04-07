const mongoose = require("mongoose");

module.exports = mongoose.model("Admin", new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  passwordHash: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}));
