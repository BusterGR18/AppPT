/*const express = require('express');
const router = express.Router();
const Contact = require('../models/contactos');

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
//V2
const express = require('express');
const router = express.Router();
const Contact = require('../models/contact'); // Adjust the path to your Contact model

// Add a new contact
router.post('/contacts', async (req, res) => {
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

module.exports = router;
*/
//V3
const express = require('express');
const router = express.Router();
const Contact = require('../models/contact'); // Adjust the path to your Contact model

// Get all contacts
router.get('/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find({ userId: req.query.userId });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching contacts' });
  }
});

// Add a new contact
router.post('/contacts', async (req, res) => {
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

// Delete a contact
router.delete('/contacts/:id', async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Contact deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting contact' });
  }
});

// Edit a contact
router.put('/contacts/:id', async (req, res) => {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedContact);
  } catch (error) {
    res.status(500).json({ error: 'Error updating contact' });
  }
});

module.exports = router;

