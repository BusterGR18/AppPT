// routes/historicalDataRouter.js
const express = require('express');
const router = express.Router();
const historicalDataController = require('../controllers/historicalDataController');

// GET historical data for a user, board, and optional date range
router.get('/', historicalDataController.getHistoricalData);
router.post('/manual-snapshot', historicalDataController.manualSnapshot);

module.exports = router;
