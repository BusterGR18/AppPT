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

exports.handleInboundMessage =async (req, res) => {
  try {
    const { msisdn, text, messageId, to } = req.body;

    console.log('Inbound Message Received:', { msisdn, text, messageId, to });

    // Optional: Process the response further (e.g., save to database, notify admin)
    
    res.status(200).send('Inbound message processed successfully');
  } catch (error) {
    console.error('Error processing inbound message:', error);
    res.status(500).send('Failed to process inbound message');
  }
};

exports.handleStatusUpdate = async (req, res) => {
  try {
    const { messageId, to, status, errorText } = req.body;

    console.log('Message Status Update:', { messageId, to, status, errorText });

    // Optional: Handle delivery failures
    if (status !== 'delivered') {
      console.warn(`Message ${messageId} to ${to} failed with status: ${status}`);
    }

    res.status(200).send('Status update processed successfully');
  } catch (error) {
    console.error('Error processing status update:', error);
    res.status(500).send('Failed to process status update');
  }
};