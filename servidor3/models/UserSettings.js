{/** 
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
*/}
const mongoose = require('mongoose');

const userSettingsSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  settings: {
    enableStatistics: { type: Boolean, default: false },
    enableGuestMode: { type: Boolean, default: false },
    enableCustomNotificationMessage: { type: Boolean, default: false },
    customNotificationMessage: { type: String },
    notifications: {
      whatsapp: { type: Boolean, default: false },
      sms: { type: Boolean, default: false },
      telegram: { type: Boolean, default: false },
    },
    selectedGuestProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'GuestProfile' },
    guestModeLogs: [
      {
        activationTime: { type: Date },
        deactivationTime: { type: Date }
      }
    ],
    displayStatistics: { type: [String], default: [] },
    excludedContacts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contacts', // Reference the contacts collection
      },
    ]
  }
});

module.exports = mongoose.model('UserSettings', userSettingsSchema);