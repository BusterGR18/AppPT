const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BoardStatsSchema = new Schema({
  boardid: { type: String, required: true },
  distanceTraveled: { type: Number, default: 0 },
  averageSpeed: { type: Number, default: 0 },
  totalRideDuration: { type: Number, default: 0 },
  accidentCount: { type: Number, default: 0 },
  maxSpeed: { type: Number, default: 0 },
  topLocations: { type: Array, default: [] },
  guestModeStats: {
    frequency: { type: Number, default: 0 },      // Number of activations
    totalDuration: { type: Number, default: 0 },  // Total duration in minutes
  },
  updatedAt: { type: Date, default: Date.now }
});

const StatisticsSchema = new Schema({
  useremail: { type: String, required: true, unique: true },
  boards: [BoardStatsSchema]
});

module.exports = mongoose.model('Statistics', StatisticsSchema);
