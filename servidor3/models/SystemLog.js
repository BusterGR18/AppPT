const mongoose = require('mongoose');

const SystemLogSchema = new mongoose.Schema(
  {
    severity: { type: String, required: true }, // e.g., 'info', 'warning', 'error'
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  {
    collection: 'SystemLog', // Explicitly specify the collection name
  }
);

module.exports = mongoose.model('SystemLog', SystemLogSchema);
