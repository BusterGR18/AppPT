// models/Settings.js
const mongoose = require('mongoose');

const AdminSettingsSchema = new mongoose.Schema({
  blockNotifications: { type: Boolean, default: false },
  maintenanceMode: { type: Boolean, default: false },
});

module.exports = mongoose.model('AdminSettings', AdminSettingsSchema);
