//V1
/*
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
*/

//V2
const mongoose = require('mongoose');
const SystemLog = require('../models/SystemLog');

const logQueue = [];
const FLUSH_INTERVAL = 5000;
const MAX_RETRIES = 3;

// Function to check if MongoDB is connected
const isMongoConnected = () => mongoose.connection.readyState === 1;

// Queue logs instead of directly inserting
const queueLog = (severity, message) => {
    console.log(`[${severity.toUpperCase()}] ${message}`);

    if (!isMongoConnected()) {
        console.warn(`[LOGGER WARNING] Skipping log: MongoDB is not connected.`);
        return;
    }

    logQueue.push({ severity, message, timestamp: new Date() });
};

// Function to flush logs
const flushLogs = async () => {
    if (logQueue.length === 0 || !isMongoConnected()) return;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
            await SystemLog.insertMany(logQueue);
            logQueue.length = 0;
            return;
        } catch (error) {
            console.error(`[LOG ERROR] Failed to save logs (Attempt ${attempt + 1}):`, error);
            await new Promise(res => setTimeout(res, 2000)); // Retry delay
        }
    }
};

// Flush logs at intervals
setInterval(flushLogs, FLUSH_INTERVAL);

// Handle reconnection events
mongoose.connection.on('connected', () => console.log('[LOGGER] MongoDB connected.'));
mongoose.connection.on('disconnected', () => console.warn('[LOGGER] MongoDB disconnected. Logging paused.'));
mongoose.connection.on('error', (err) => console.error('[LOGGER ERROR]', err));

module.exports = {
    info: (message) => queueLog('info', message),
    warning: (message) => queueLog('warning', message),
    error: (message) => queueLog('error', message),
};
