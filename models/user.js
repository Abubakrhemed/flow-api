const mongoose = require("mongoose");

const tabStatSchema = new mongoose.Schema(
  {
    active_tab_title: { type: String, required: true },
    active_tab_url: { type: String },
    category: { type: String, default: "Other" },
    time_spent: { type: Number, default: 0 },
    lastUpdate: { type: Number },
  },
  { _id: false },
);

const dailyStatsSchema = new mongoose.Schema(
  {
    date: { type: String, required: true }, 
    stats: { type: [tabStatSchema], default: [] },
    totalTime: { type: Number, default: 0 },
  },
  { _id: false },
);

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
  dailyStats: {
    type: [dailyStatsSchema],
    default: [],
  },
});

module.exports = mongoose.model("User", userSchema);