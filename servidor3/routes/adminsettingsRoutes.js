// routes/adminsettingsRoutes.js
const express = require('express');
const router = express.Router();
const adminSettingsController = require('../controllers/adminSettingsController');

// Routes
router.get('/', adminSettingsController.getSettings);
router.post('/', adminSettingsController.updateSettings);

module.exports = router;
