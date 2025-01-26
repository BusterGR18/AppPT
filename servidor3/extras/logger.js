const mongoose = require('mongoose');
const SystemLog = require('../models/SystemLog'); // Import your SystemLog model

const logMessage = async (severity, message) => {
  // Log to console
  console.log(`[${severity.toUpperCase()}] ${message}`);
  
  try {
    // Save log to the database
    await SystemLog.create({ severity, message, timestamp: new Date() });
  } catch (error) {
    console.error('[LOG ERROR] Failed to save log to database:', error);
  }
};

module.exports = {
  info: (message) => logMessage('info', message),
  warning: (message) => logMessage('warning', message),
  error: (message) => logMessage('error', message),
};
