const express = require('express');
const router = express.Router();
const telemetryController = require('../controllers/telemetryController');

// Get the latest location for a specific useremail and boardid combo
router.get('/location/:useremail/:boardid', telemetryController.verifyToken, telemetryController.getLatestLocation);

router.get('/battery/:useremail/:boardid', telemetryController.verifyToken, telemetryController.getLatestBatteryStatus);

module.exports = router;
