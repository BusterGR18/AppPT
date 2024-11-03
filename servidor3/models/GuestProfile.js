// models/GuestProfile.js
const mongoose = require('mongoose');

const GuestProfileSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    boardID: { type: String, default: null },
    locationPolygon: {
      type: {
        type: String, 
        enum: ['Polygon'], 
        required: true
      },
      coordinates: {
        type: [[[Number]]], // Array of arrays of coordinates
        required: true
      }
    },
    contacts: [
      {
        name: { type: String, required: true },
        phoneNumber: { type: String, required: true }
      }
    ]
  });
  

module.exports = mongoose.model('GuestProfile', GuestProfileSchema);
