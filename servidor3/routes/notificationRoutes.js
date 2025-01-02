const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

router.post('/:accidentId', notificationController.triggerNotifications);
// New route for inbound messages from Vonage
router.post('/inbound', notificationController.handleInboundMessage);

// New route for status updates from Vonage
router.post('/status', notificationController.handleStatusUpdate);

module.exports = router;
