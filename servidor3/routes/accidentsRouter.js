const express = require('express');
const router = express.Router();
const Accidente = require('../models/Accidente');

// Route to get all accident reports
router.get('/', async (req, res) => {
  try {
    const reports = await Accidente.find();
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching accident reports', error });
  }
});

// Route to get a specific accident report by ID
router.get('/:id', async (req, res) => {
  try {
    const report = await Accidente.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Accident report not found' });
    }
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching accident report', error });
  }
});

module.exports = router;
