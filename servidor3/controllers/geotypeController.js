const express = require('express');
const router = express.Router();
const GeoType = require('../models/GeoType'); // Assuming you have a GeoType model
const jwt = require('jsonwebtoken');

// Middleware to verify JWT and extract user email
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(500).json({ message: 'Failed to authenticate token' });

    req.userEmail = decoded.email; // Assuming the token contains the user email
    next();
  });
};

// Fetch all geoTypes for a specific user
router.get('/', verifyToken, async (req, res) => {
  try {
    const geoTypes = await GeoType.find({ useremail: req.userEmail });
    res.json(geoTypes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching geoTypes', error });
  }
});

// Add a new geoType for a specific user
router.post('/', verifyToken, async (req, res) => {
  const { geojsonData } = req.body;
  const newGeoType = new GeoType({ geojsonData, useremail: req.userEmail });
  try {
    await newGeoType.save();
    res.json(newGeoType);
  } catch (error) {
    res.status(500).json({ message: 'Error adding geoType', error });
  }
});

// Update a geoType for a specific user
router.put('/:id', verifyToken, async (req, res) => {
  const { geojsonData } = req.body;
  try {
    const updatedGeoType = await GeoType.findOneAndUpdate(
      { _id: req.params.id, useremail: req.userEmail },
      { geojsonData },
      { new: true }
    );
    if (!updatedGeoType) return res.status(404).json({ message: 'GeoType not found' });
    res.json(updatedGeoType);
  } catch (error) {
    res.status(500).json({ message: 'Error updating geoType', error });
  }
});

// Delete a geoType for a specific user
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const deletedGeoType = await GeoType.findOneAndDelete({ _id: req.params.id, useremail: req.userEmail });
    if (!deletedGeoType) return res.status(404).json({ message: 'GeoType not found' });
    res.json({ message: 'GeoType deleted', deletedGeoType });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting geoType', error });
  }
});

module.exports = router;
