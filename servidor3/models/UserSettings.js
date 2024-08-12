const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  settings: {
    enableStatistics: { type: Boolean, default: false },
    enableGuestMode: { type: Boolean, default: false },
    enableCustomNotificationMessage: {type: Boolean, default: false},
    CustomNotificationMessage: {type: String, default: ""}
  }
});

module.exports = mongoose.model('UserSettings', UserSchema);