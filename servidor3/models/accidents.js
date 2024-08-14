const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AccidenteSchema = new Schema({
  accidentType: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  boardid: {
    type: String,
    required: true,
  },
  notifiedContacts: [
    {
      name: {
        type: String,
        required: true,
      },
      phoneNumber: {
        type: String,
        required: true,
      },
    },
  ],
  location: {
    type: {
        type: String,
        default: 'location',  // Fixed value for location type
      },
      value: {
        type: String,
        required: true,  // e.g., "Latitude: 1933.499117,N, Longitude: 09910.618063,W"
    },
    required: true,
  },
  timeOfAccident: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model('Accidente', AccidenteSchema);
