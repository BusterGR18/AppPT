const express = require('express');
const router = express.Router();
const GeoType = require('../models/GeoType'); // Assuming you have a GeoType model

// Get all geoTypes for a specific user
router.get('/', async (req, res) => {
  try {
    const userEmail = req.query.useremail;
    const geoTypes = await GeoType.find({ useremail: userEmail });
    res.json(geoTypes);
  } catch (error) {
    console.error('Error fetching geoTypes:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add a new geoType
router.post('/', async (req, res) => {
  const newGeoType = new GeoType(req.body);
  try {
    const savedGeoType = await newGeoType.save();
    res.json(savedGeoType);
  } catch (error) {
    console.error('Error adding geoType:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a geoType
router.delete('/:id', async (req, res) => {
  try {
    await GeoType.findByIdAndDelete(req.params.id);
    res.json({ message: 'GeoType deleted' });
  } catch (error) {
    console.error('Error deleting geoType:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Edit a geoType
router.put('/:id', async (req, res) => {
  try {
    const updatedGeoType = await GeoType.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedGeoType);
  } catch (error) {
    console.error('Error updating geoType:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
