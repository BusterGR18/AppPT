const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  settings: {
    enableStatistics: { type: Boolean, default: false },
    enableGuestMode: { type: Boolean, default: false },
    enableCustomNotificationMessage: { type: Boolean, default: false },
    customNotificationMessage: { type: String, default: "" },
    notifications: {
      whatsapp: { type: Boolean, default: false },
      sms: { type: Boolean, default: false },
      telegram: { type: Boolean, default: false }
    },
    selectedGuestProfile: { type: String, default: "" }
  }
});

module.exports = mongoose.model('UserSettings', UserSchema);
