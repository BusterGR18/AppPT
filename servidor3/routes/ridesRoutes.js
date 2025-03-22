const express = require('express');
const router = express.Router();
const rideController = require('../controllers/ridesController');

// Fetch all rides for a specific user
router.get('/user', rideController.getUserRides);

// Fetch all rides for a specific board
router.get('/board/:boardId', rideController.getBoardRides);

// Fetch a single ride by ID
router.get('/:rideId', rideController.getRideById);

// Delete a ride (optional)
router.delete('/:rideId', rideController.deleteRide);

// Get ride statistics for a user
router.get('/stats/user', rideController.getRideStats);

module.exports = router;
