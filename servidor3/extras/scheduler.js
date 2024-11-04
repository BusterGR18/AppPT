// scheduler.js

const cron = require('node-cron');
const { updateStatistics } = require('../controllers/statisticsController');

// Schedule the job to run at 00:00 GMT-6 (06:00 UTC)
cron.schedule('0 6 * * *', async () => {
  console.log('Scheduled statistics update triggered at 00:00 GMT-6');
  try {
    await updateStatistics();
    console.log('Statistics updated successfully');
  } catch (error) {
    console.error('Error updating statistics:', error);
  }
});

module.exports = cron;
