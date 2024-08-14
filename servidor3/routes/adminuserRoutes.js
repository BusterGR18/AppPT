// routes/adminuserRoutes.js
const express = require('express');
const router = express.Router();
const adminuserController = require('../controllers/adminuserController');

// Route to get all users
router.get('/users', adminuserController.getAllUsers);

// Route to get clients only    
router.get('/clients', adminuserController.getAllClients);

// Route to delete a user by ID 
router.delete('/users/:id', adminuserController.deleteUser);

// Route to register a new admin user
router.post('/register', adminuserController.registerAdmin);

module.exports = router;
