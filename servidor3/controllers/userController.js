// userController.js
const User = require('../models/user'); // Import the User model


exports.updateUserDetails = async (req, res) => {
  const { useremail } = req.query; // Get user email from query parameters
  const { name, email, numtel, tiposangre } = req.body; // Get fields to update from request body

  const updateFields = {};
  if (name) updateFields.name = name;
  if (email) updateFields.email = email;
  if (numtel) updateFields.numtel = numtel;
  if (tiposangre) updateFields.tiposangre = tiposangre;

  if (Object.keys(updateFields).length === 0) {
    return res.status(400).json({ error: "No fields provided for update." });
  }

  try {
    const updatedUser = await User.findOneAndUpdate(
      { email: useremail }, // Match user by email
      { $set: updateFields }, // Update specified fields
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({ message: "User details updated successfully.", user: updatedUser });
  } catch (error) {
    console.error("Error updating user details:", error);
    res.status(500).json({ error: "Failed to update user details." });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const useremail = req.user.email; // Extract email from the decoded token

    const user = await User.findOne({ email: useremail }, 'name email numtel tiposangre').lean();
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
