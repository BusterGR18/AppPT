const express = require('express');
const router = express.Router();
const Contact = require('../models/contact');

// Fetch all contacts for a specific user
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find({ userId: req.query.userId });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching contacts' });
  }
});

// Add a new contact for a specific user
router.post('/', async (req, res) => {
  const { alias, number, userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const newContact = new Contact({ alias, number, userId });
    const savedContact = await newContact.save();
    res.status(201).json(savedContact);
  } catch (error) {
    res.status(500).json({ error: 'Error adding contact' });
  }
});

// Delete a contact for a specific user
router.delete('/:id', async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Contact deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting contact' });
  }
});

// Edit a contact for a specific user
router.put('/:id', async (req, res) => {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedContact);
  } catch (error) {
    res.status(500).json({ error: 'Error updating contact' });
  }
});

module.exports = router;
