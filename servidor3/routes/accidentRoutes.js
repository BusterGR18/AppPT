// routes/accidentRoutes.js
const express = require('express');
const router = express.Router();
const accidentController = require('../controllers/accidentController');

router.post('/', accidentController.createAccident);
router.get('/', accidentController.getAccidents); 
router.get('/count', accidentController.getAccidentCount);
router.get('/guest-accident-history', accidentController.getGuestAccidentHistory);


module.exports = router;
