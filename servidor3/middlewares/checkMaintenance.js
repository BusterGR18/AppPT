// middleware/checkMaintenance.js
const AdminSettings = require('../models/AdminSettings');

const checkMaintenance = async (req, res, next) => {
  try {
    const settings = await AdminSettings.findOne();
    if (settings?.maintenanceMode) {
      // Allow admins to bypass maintenance mode
      if (req.user && req.user.role === 'admin') {
        return next();
      }
      return res.status(503).json({
        error: 'The system is currently under maintenance. Please try again later.',
      });
    }
    next();
  } catch (error) {
    console.error('Error checking maintenance mode:', error);
    res.status(500).json({ error: 'Failed to check maintenance mode' });
  }
};

module.exports = checkMaintenance;
