// middleware/checkNotifications.js
const AdminSettings = require('../models/AdminSettings');

const checkNotifications = async (req, res, next) => {
  try {
    const settings = await AdminSettings.findOne();
    if (settings?.blockNotifications) {
      return res.status(403).json({ error: 'Notifications are currently blocked by the admin.' });
    }
    next();
  } catch (error) {
    console.error('Error checking notifications block status:', error);
    res.status(500).json({ error: 'Failed to check notification settings' });
  }
};

module.exports = checkNotifications;
