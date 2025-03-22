const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  boardId: { type: String, required: true },
  userEmail: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  totalDistance: { type: Number, default: 0 }, // In kilometers
  maxSpeed: { type: Number, default: 0 }, // In km/h
  locations: [
    {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      timestamp: { type: Date, required: true },
    },
  ],
});

module.exports = mongoose.model('Ride', rideSchema);
