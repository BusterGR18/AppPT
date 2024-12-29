const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

router.post('/:accidentId', notificationController.triggerNotifications);

module.exports = router;
