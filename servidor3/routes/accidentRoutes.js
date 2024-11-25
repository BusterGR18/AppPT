// routes/accidentRoutes.js
const express = require('express');
const router = express.Router();
const accidentController = require('../controllers/accidentController');

router.post('/', accidentController.createAccident);
router.get('/', accidentController.getAccidents); 

module.exports = router;
