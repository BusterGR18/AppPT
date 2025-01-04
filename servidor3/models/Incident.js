const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  incidentType: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
  },
  boardId: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: false,
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
  phoneNumber: {
    type: String,
    required: true,
  },
  timeOfIncident: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Incident', incidentSchema);
