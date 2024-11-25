// models/Accident.js
const mongoose = require('mongoose');

const AccidentSchema = new mongoose.Schema({
  accidentType: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  boardId: {
    type: String,
    required: true,
  },
  isGuestMode: {
    type: Boolean,
    required: true,
  },
  guestProfileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GuestProfile',
    default: null,
  },
  notifiedContacts: [
    {
      alias: { type: String, required: true },
      number: { type: String, required: true },
    },
  ],
  location: {
    type: {
      type: String,
      default: 'location',
    },
    value: { type: String, required: true }, // e.g., "Latitude: 1933.499117,N, Longitude: 09910.618063,W"
  },
  timeOfAccident: { type: Date, required: true },
});

module.exports = mongoose.model('Accident', AccidentSchema);
