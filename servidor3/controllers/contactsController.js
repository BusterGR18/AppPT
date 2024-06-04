const express = require('express');
const router = express.Router();
const Contact = require('../models/contact');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT and extract user ID
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(500).json({ message: 'Failed to authenticate token' });

    req.userId = decoded.id; // Ensure this matches the payload structure in your JWT
    next();
  });
};

// Fetch all contacts for a specific user
router.get('/', verifyToken, async (req, res) => {
  try {
    const contacts = await Contact.find({ userId: req.id });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contacts', error });
  }
});

// Add a new contact for a specific user
router.post('/', verifyToken, async (req, res) => {
  const { alias, number } = req.body;

  if (!alias || !number) {
    return res.status(400).json({ message: 'Alias and number are required' });
  }

  const newContact = new Contact({ alias, number, userId: req.userId });
  try {
    await newContact.save();
    res.json(newContact);
  } catch (error) {
    res.status(500).json({ message: 'Error adding contact', error });
  }
});

// Update a contact for a specific user
router.put('/:id', verifyToken, async (req, res) => {
  const { alias, number } = req.body;

  if (!alias || !number) {
    return res.status(400).json({ message: 'Alias and number are required' });
  }

  try {
    const updatedContact = await Contact.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { alias, number },
      { new: true }
    );
    if (!updatedContact) return res.status(404).json({ message: 'Contact not found' });
    res.json(updatedContact);
  } catch (error) {
    res.status(500).json({ message: 'Error updating contact', error });
  }
});

// Delete a contact for a specific user
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const deletedContact = await Contact.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!deletedContact) return res.status(404).json({ message: 'Contact not found' });
    res.json({ message: 'Contact deleted', deletedContact });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting contact', error });
  }
});

module.exports = router;
