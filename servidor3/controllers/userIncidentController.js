const NotificationService = require('../services/notificationService');
const User = require('../models/user');

exports.handleUserIncidentNotification = async (req, res) => {
  const { userId, notificationType, details } = req.body;

  try {
    // Validate input
    if (!userId || !notificationType) {
      return res.status(400).json({ error: 'User ID and Notification Type are required.' });
    }

    // Fetch user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Send notification
    const result = await NotificationService.sendUserNotification({
      userEmail: user.email,
      notificationType,
      details,
    });

    res.status(200).json({ message: 'Notification sent successfully.', result });
  } catch (error) {
    console.error('Error handling user incident notification:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
