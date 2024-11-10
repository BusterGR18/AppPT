// models/HistoricalData.js
const mongoose = require('mongoose');

const historicalDataSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  boardId: { type: String, required: true },
  date: { type: Date, default: Date.now },
  data: {
    distanceTraveled: { type: Number },
    averageSpeed: { type: Number },
    totalRideDuration: { type: Number },
    accidentCount: { type: Number },
    maxSpeed: { type: Number },
    guestModeStats: {
      frequency: { type: Number },
      totalDuration: { type: Number },
    },
    topLocations: [
      {
        latitude: { type: Number },
        longitude: { type: Number },
        visitCount: { type: Number },
      }
    ],
  },
});

module.exports = mongoose.model('HistoricalData', historicalDataSchema);
