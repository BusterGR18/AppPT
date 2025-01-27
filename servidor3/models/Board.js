// Board Schema
const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
  boardId: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  name: { type: String, default: 'Unnamed Board' },
  mode: {
    type: String,
    enum: ['normal', 'guest'],
    default: 'normal',
  },
  geoTypes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GeoType' }],
  notificationsEnabled: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Board', boardSchema);