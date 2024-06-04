// models/GeoType.js

const mongoose = require('mongoose');

const GeoTypeSchema = new mongoose.Schema({
  geojsonData: {
    type: Object,
    required: true,
  },
  useremail: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const GeoType = mongoose.model('GeoType', GeoTypeSchema);

module.exports = GeoType;
