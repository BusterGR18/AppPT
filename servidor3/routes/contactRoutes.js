const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// Get all contacts
router.get('/', async (req, res) => {
  const contacts = await Contact.find();
  res.json(contacts);
});

// Add a new contact
router.post('/', async (req, res) => {
  const newContact = new Contact(req.body);
  const savedContact = await newContact.save();
  res.json(savedContact);
});

// Delete a contact
router.delete('/:id', async (req, res) => {
  await Contact.findByIdAndDelete(req.params.id);
  res.json({ message: 'Contact deleted' });
});

// Edit a contact
router.put('/:id', async (req, res) => {
  const updatedContact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedContact);
});

module.exports = router;
