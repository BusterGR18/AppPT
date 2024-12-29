/*const { Vonage } = require('@vonage/server-sdk');
const Accident = require('../models/Accident');
const User = require('../models/user');

const vonage = new Vonage({
  apiKey: 'YOUR_API_KEY',
  apiSecret: 'YOUR_API_SECRET',
});


const generateAccidentMessage = (accident) => {
  const { accidentType, boardId, location } = accident;
  return `ALERTA: Accidente tipo "${accidentType}" en el board ${boardId}. Ubicación: ${location.value}`;
};

const generateUserMessage = (notificationType, details) => {
  const messages = {
    lowBattery: `ALERTA: La batería está baja. Detalles: ${details}`,
    bikeFall: `ALERTA: Tu motocicleta se ha caído. Detalles: ${details}`,
    test: `NOTIFICACIÓN: Este es un mensaje de prueba. Detalles: ${details}`,
  };

  return messages[notificationType] || `NOTIFICACIÓN: ${details}`;
};


const sendNotification = async (to, message) => {
  try {
    const response = await vonage.sms.send({
      to,
      from: 'MotoAlert',
      text: message,
    });
    return { status: 'success', response };
  } catch (error) {
    console.error(`Error sending SMS to ${to}:`, error.message);
    return { status: 'failed', error: error.message };
  }
};


exports.notifyAccidentContacts = async (accidentId) => {
  try {
    const accident = await Accident.findById(accidentId);
    if (!accident) throw new Error('Accident not found');
    const message = generateAccidentMessage(accident);

    const results = [];
    for (const contact of accident.notifiedContacts) {
      const result = await sendNotification(contact.number, message);
      results.push({ contact, result });
    }
    console.log('Accident notifications sent:', results);
    return results;
  } catch (error) {
    console.error('Error notifying accident contacts:', error.message);
    throw error;
  }
};


exports.notifyUser = async (userId, notificationType, details) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const message = generateUserMessage(notificationType, details);
    const result = await sendNotification(user.numtel, message);

    console.log(`User notification sent to ${user.name}:`, result);
    return result;
  } catch (error) {
    console.error('Error notifying user:', error.message);
    throw error;
  }
};

*/
//V2
const { Vonage } = require('@vonage/server-sdk');
const Accident = require('../models/Accident');

const vonageInstance = new Vonage({
  apiKey: 'YOUR_API_KEY',
  apiSecret: 'YOUR_API_SECRET',
});

const NotificationService = {
  /**
   * Notify contacts for an accident.
   */
  notifyContacts: async (accident) => {
    try {
      const { notifiedContacts, location, accidentType, timeOfAccident } = accident;

      const promises = notifiedContacts.map(async (contact) => {
        const message = `Alert: ${accidentType} reported at ${location.value} on ${new Date(
          timeOfAccident
        ).toLocaleString()}. Please check immediately.`;

        // Send SMS to the contact
        await vonageInstance.message.sendSms('System', contact.number, message);

        console.log(`Notification sent to ${contact.alias}: ${contact.number}`);
        return { alias: contact.alias, number: contact.number, status: 'sent' };
      });

      const results = await Promise.all(promises);
      return results;
    } catch (error) {
      console.error('Error notifying contacts:', error);
      throw error;
    }
  },

  /**
   * Notify user for an incident (e.g., bike fall, low battery).
   */
  sendUserNotification: async ({ userEmail, notificationType, details }) => {
    try {
      const messages = {
        lowBattery: `Alert: Your bike's battery is low. ${details}`,
        bikeFall: `Alert: Your bike may have fallen over. ${details}`,
        test: `Test notification: ${details}`,
      };

      const message = messages[notificationType];
      if (!message) {
        throw new Error(`Unknown notification type: ${notificationType}`);
      }

      // Use Vonage or another SMS service to send the notification
      await vonageInstance.message.sendSms('System', userEmail, message);

      console.log(`Notification sent: ${message}`);
      return { status: 'success', message };
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  },
};

module.exports = NotificationService;