// controllers/guestProfileController.js
const GuestProfile = require('../models/GuestProfile');

// Get all guest profiles
exports.getGuestProfiles = async (req, res) => {
  try {
    const guestProfiles = await GuestProfile.find();
    res.json(guestProfiles);
  } catch (error) {
    console.error('Error fetching guest profiles:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create a new guest profile
exports.createGuestProfile = async (req, res) => {
  const { name, email, phoneNumber, boardID, locationPolygon, contacts } = req.body;
  try {
    const newGuestProfile = new GuestProfile({
      name,
      email,
      phoneNumber,
      boardID,
      locationPolygon,
      contacts
    });
    await newGuestProfile.save();
    res.status(201).json(newGuestProfile);
  } catch (error) {
    console.error('Error creating guest profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update an existing guest profile
exports.updateGuestProfile = async (req, res) => {
  const { id } = req.params;
  const { name, email, phoneNumber, boardID, locationPolygon, contacts } = req.body;
  try {
    const updatedGuestProfile = await GuestProfile.findByIdAndUpdate(
      id,
      { name, email, phoneNumber, boardID, locationPolygon, contacts },
      { new: true }
    );
    if (!updatedGuestProfile) {
      return res.status(404).json({ error: 'Guest profile not found' });
    }
    res.json(updatedGuestProfile);
  } catch (error) {
    console.error('Error updating guest profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a guest profile
exports.deleteGuestProfile = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedGuestProfile = await GuestProfile.findByIdAndDelete(id);
    if (!deletedGuestProfile) {
      return res.status(404).json({ error: 'Guest profile not found' });
    }
    res.json({ message: 'Guest profile deleted' });
  } catch (error) {
    console.error('Error deleting guest profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getGuestProfileById = async (req, res) => {
    const { id } = req.params; // Ensure this matches the route setup
  
    try {
      const guestProfile = await GuestProfile.findById(id);
      if (!guestProfile) {
        return res.status(404).json({ error: 'Guest profile not found' });
      }
      res.json(guestProfile);
    } catch (error) {
      console.error('Error fetching guest profile:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };