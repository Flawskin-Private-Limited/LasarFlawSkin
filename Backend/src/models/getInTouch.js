const mongoose = require("mongoose");

module.exports = mongoose.model("Contact", new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  status: { type: String, default: "new" },
  createdAt: { type: Date, default: Date.now }
}));
