const NotificationService = require('../services/notificationService');
const Accident = require('../models/Accident');

exports.triggerNotifications = async (req, res) => {
  const { accidentId } = req.params;

  try {
    // Fetch accident details
    const accident = await Accident.findById(accidentId);
    if (!accident) {
      return res.status(404).json({ error: 'Accident not found' });
    }

    const results = await NotificationService.notifyContacts(accident);
    res.status(200).json({ message: 'Notifications sent successfully', results });
  } catch (error) {
    console.error('Error triggering notifications:', error);
    res.status(500).json({ error: 'Failed to send notifications' });
  }
};
