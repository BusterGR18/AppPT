const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  settings: {
    enableStatistics: { type: Boolean, default: false },
    enableGuestMode: { type: Boolean, default: false }
  }
});

module.exports = mongoose.model('UserSettings', UserSchema);