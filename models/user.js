const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  stats: {
    type: Array,
  },
  TotalTime: Number,
});

module.exports = mongoose.model("User", userSchema);
