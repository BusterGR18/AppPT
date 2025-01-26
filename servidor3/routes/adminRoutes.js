const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Routes
router.get('/systemlogs', adminController.getSystemLogs);
router.get('/user-metrics', adminController.getUserMetrics);
router.get('/telemetry-summary', adminController.getTelemetrySummary);

module.exports = router;
