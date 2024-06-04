const express = require('express');
const router = express.Router();
const Contact = require('../models/contact'); // Assuming you have a Contact model
const jwt = require('jsonwebtoken');

// Middleware to verify JWT and extract user ID
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(500).json({ message: 'Failed to authenticate token' });

    req.userEmail = decoded.email; // Assuming the token contains the user ID as 'id'
    next();
  });
};

// Fetch all contacts for a specific user
router.get('/', verifyToken, async (req, res) => {
  try {
    const contacts = await Contact.find({ userId: req.userEmail });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contacts', error });
  }
});

// Add a new contact for a specific user
router.post('/', verifyToken, async (req, res) => {
  const { alias, number } = req.body;
  const newContact = new Contact({ alias, number, useremail: req.userEmail });
  try {
    await newContact.save();
    res.json(newContact);
  } catch (error) {
    res.status(500).json({ message: 'Error adding contact', error });
  }
});

// Update a contact for a specific user
router.put('/:email', verifyToken, async (req, res) => {
  const { alias, number } = req.body;
  try {
    const updatedContact = await Contact.findOneAndUpdate(
      { _id: req.params.email, userEmail: req.userEmail },
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
router.delete('/:email', verifyToken, async (req, res) => {
  try {
    const deletedContact = await Contact.findOneAndDelete({ _id: req.params.email, useremail: req.userEmail });
    if (!deletedContact) return res.status(404).json({ message: 'Contact not found' });
    res.json({ message: 'Contact deleted', deletedContact });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting contact', error });
  }
});

module.exports = router;
