const express = require('express');
const router = express.Router();
const Accidente = require('../models/Accidente');

// GET all accident reports
router.get('/accidents', async (req, res) => {
  try {
    const accidentReports = await Accidente.find().populate('user', 'name email');
    res.json(accidentReports);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching accident reports', error });
  }
});

// GET a specific accident report by ID
router.get('/accidents/:id', async (req, res) => {
  try {
    const accidentReport = await Accidente.findById(req.params.id).populate('user', 'name email');
    if (!accidentReport) {
      return res.status(404).json({ message: 'Accident report not found' });
    }
    res.json(accidentReport);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching accident report', error });
  }
});

module.exports = router;
