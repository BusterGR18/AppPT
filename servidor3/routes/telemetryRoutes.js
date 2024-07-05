// telemetryRoutes.js

const express = require('express');
const router = express.Router();
const telemetryController = require('../controllers/telemetryController');

// Route to get the latest location for a specific useremail and boardid combo
router.get('/location/:useremail/:boardid', telemetryController.getLatestLocation);

// Route to get the latest battery status for a specific useremail and boardid combo
router.get('/battery/:useremail/:boardid', telemetryController.getLatestBatteryStatus);

// Route to get boardIDs for a specific useremail
router.get('/boardIDs/:useremail', telemetryController.getBoardIDsForUser);

module.exports = router;
