// controllers/settingsController.js
const Settings = require('../models/UserSettings');

const getSettings = async (req, res) => {
  try {
    const user = await Settings.findOne({ username: req.query.useremail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateSettings = async (req, res) => {
  try {
    const user = await Settings.findOneAndUpdate(
      { username: req.query.useremail },
      { settings: req.body },
      { new: true, upsert: true }
    );
    res.json(user.settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getSettings,
  updateSettings
};
