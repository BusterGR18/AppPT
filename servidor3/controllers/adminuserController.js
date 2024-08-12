// controllers/adminuserController.js
const User = require('../models/user');

// Fetch all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// Get all client users
exports.getAllClients = async (req, res) => {
    try {
      const clientUsers = await User.find({ usertype: 'client' }).select('name email');
      res.status(200).json(clientUsers);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching client users', error });
    }
  };

// Delete a user by ID
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
};

// Register a new admin user
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, numtel, password } = req.body;
    const newAdmin = new User({
      name,
      email,
      numtel,
      password,
      usertype: 'admin',
      iddispositivo: '666',        // Fixed value for admins
      tiposangre: 'O+'             // Default value for admins
    });
    await newAdmin.save();
    res.json({ message: 'Admin user registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering admin user' });
  }
};
