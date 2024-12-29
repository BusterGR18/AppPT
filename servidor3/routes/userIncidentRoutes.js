const express = require('express');
const router = express.Router();
const userIncidentController = require('../controllers/userIncidentController');

// Route for handling user incidents
router.post('/user', userIncidentController.handleUserIncidentNotification);

module.exports = router;
