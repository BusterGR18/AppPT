// controllers/settingsController.js
const Settings = require('../models/AdminSettings');

// Get current settings
exports.getSettings = async (req, res) => {
  try {
    const settings = await Settings.findOne() || new Settings();
    res.status(200).json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
};

// Update settings
exports.updateSettings = async (req, res) => {
  try {
    const { blockNotifications, maintenanceMode } = req.body;

    const settings = await Settings.findOneAndUpdate(
      {},
      { blockNotifications, maintenanceMode },
      { new: true, upsert: true } // Create if not exists
    );

    res.status(200).json(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
};
