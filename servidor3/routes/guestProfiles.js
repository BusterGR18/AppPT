// routes/guestProfiles.js
const express = require('express');
const router = express.Router();
const guestProfileController = require('../controllers/guestProfileController');

router.get('/', guestProfileController.getGuestProfiles);
router.post('/', guestProfileController.createGuestProfile);
router.put('/:id', guestProfileController.updateGuestProfile);
router.delete('/:id', guestProfileController.deleteGuestProfile);
// Add this route for fetching guest profile by ID
router.get('/:id', guestProfileController.getGuestProfileById);

module.exports = router;
