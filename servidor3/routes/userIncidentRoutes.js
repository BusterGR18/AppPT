const express = require('express');
const router = express.Router();
const userIncidentController = require('../controllers/userIncidentController');

router.post('/', userIncidentController.createIncident);
router.get('/', userIncidentController.getIncidents); 
router.get('/count', userIncidentController.getIncidentCount);
router.get('/guest-incident-history', userIncidentController.getGuestIncidentHistory);

module.exports = router;
