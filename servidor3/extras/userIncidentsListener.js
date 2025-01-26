/*const mqtt = require('mqtt');


// MQTT Broker Details
const MQTT_BROKER = "c4527dc1a0d9425f8b451446a7ebca7f.s1.eu.hivemq.cloud";
const MQTT_PORT = 8883;
const MQTT_TOPIC = "user/incidents"; // A dedicated topic for user incidents

// MQTT Connection Options
const options = {
  port: MQTT_PORT,
  clientId: `mqtt_user_incidents_${Math.random().toString(16).slice(3)}`,
  username: "board1",
  password: "Cacas1234",
  clean: true,
  reconnectPeriod: 1000,
};

// Connect to the MQTT broker
const client = mqtt.connect(`mqtts://${MQTT_BROKER}`, options);

client.on('connect', () => {
  console.log(`Connected to MQTT broker at ${MQTT_BROKER}:${MQTT_PORT}`);
  client.subscribe(MQTT_TOPIC, (err) => {
    if (err) {
      console.error(`Error subscribing to topic ${MQTT_TOPIC}:`, err);
    } else {
      console.log(`Subscribed to topic ${MQTT_TOPIC}`);
    }
  });
});
*/
//v1.1 shiity implementation
/*
const mqtt = require('mqtt');
const Incident = require('../models/Incident');
const User = require('../models/user');
const GuestProfile = require('../models/GuestProfile');
const UserSettings = require('../models/UserSettings');
const axios = require('axios');

const MQTT_BROKER = "c4527dc1a0d9425f8b451446a7ebca7f.s1.eu.hivemq.cloud";
const MQTT_PORT = 8883;
const MQTT_TOPIC = "user/incidents";

const options = {
  port: MQTT_PORT,
  clientId: `mqtt_user_incidents_${Math.random().toString(16).slice(3)}`,
  username: "board1",
  password: "Cacas1234",
  clean: true,
  reconnectPeriod: 1000,
};

const client = mqtt.connect(`mqtts://${MQTT_BROKER}`, options);

client.on('connect', () => {
  console.log(`Connected to MQTT broker at ${MQTT_BROKER}:${MQTT_PORT}`);
  client.subscribe(MQTT_TOPIC, (err) => {
    if (err) {
      console.error(`Error subscribing to topic ${MQTT_TOPIC}:`, err);
    } else {
      console.log(`Subscribed to topic ${MQTT_TOPIC}`);
    }
  });
});

client.on('message', async (topic, message) => {
  try {
    const parsedMessage = JSON.parse(message.toString());
    console.log('Received MQTT message for incident:', parsedMessage);

    const { incidentType, email, boardId, details } = parsedMessage;

    const user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
    if (!user) {
      console.error(`User with email ${email} not found.`);
      return;
    }

    // Fetch user settings
    const userSettings = await UserSettings.findOne({ username: email });
    if (!userSettings) {
      console.error(`User settings not found for email: ${email}`);
      return;
    }

    const isGuestMode = userSettings.settings.enableGuestMode;
    console.log(`Guest mode status for ${email}:`, isGuestMode);

    let phoneNumber;

    if (isGuestMode) {
      const guestProfile = await GuestProfile.findById(userSettings.settings.selectedGuestProfile);
      if (guestProfile && guestProfile.phoneNumber) {
        phoneNumber = guestProfile.phoneNumber;
      } else {
        console.error(`Guest profile or phone number not found for guest mode.`);
        return;
      }
    } else {
      const user = await User.findOne({ email: email });
      if (user && user.numtel) {
        phoneNumber = user.numtel;
      } else {
        console.error(`User or phone number not found for email: ${email}`);
        return;
      }
    }

    console.log(`Phone number for notification: ${phoneNumber}`);

    const timeOfIncident = new Date();

    // Save the incident to the database
    const newIncident = new Incident({
      incidentType,
      user: User._id,
      boardId,
      details,
      isGuestMode,
      guestProfileId: isGuestMode ? userSettings.settings.selectedGuestProfile : null,
      phoneNumber,
      timeOfIncident,
    });

    await newIncident.save();
    console.log('Incident saved successfully:', newIncident);

    // Trigger notification
    const notificationMessage = `Alert: ${incidentType} reported on board ${boardId}. Details: ${details}`;
    await axios.post(`http://localhost:4000/api/notifications/incidents/${newIncident._id}`);
    // dry run
    console.log('Notification API triggered for incident:', newIncident._id);

  } catch (error) {
    console.error('Error processing MQTT message for incident:', error);
  }
});

module.exports = client;
*/
const logger = require('./logger');
const mqtt = require('mqtt');
const Incident = require('../models/Incident');
const User = require('../models/user');
const GuestProfile = require('../models/GuestProfile');
const UserSettings = require('../models/UserSettings');
const axios = require('axios');

const MQTT_BROKER = "c4527dc1a0d9425f8b451446a7ebca7f.s1.eu.hivemq.cloud";
const MQTT_PORT = 8883;
const MQTT_TOPIC = "user/incidents";

const options = {
  port: MQTT_PORT,
  clientId: `mqtt_user_incidents_${Math.random().toString(16).slice(3)}`,
  username: "board1",
  password: "Cacas1234",
  clean: true,
  reconnectPeriod: 1000,
};

const client = mqtt.connect(`mqtts://${MQTT_BROKER}`, options);

client.on('connect', () => {
  logger.info(`[Incidents] Connected to MQTT broker at ${MQTT_BROKER}:${MQTT_PORT}`);
  client.subscribe(MQTT_TOPIC, (err) => {
    if (err) {
      logger.error(`Error subscribing to topic ${MQTT_TOPIC}:`, err);
    } else {
      logger.info(`[Incidents] Subscribed to topic ${MQTT_TOPIC}`);
    }
  });
});

client.on('message', async (topic, message) => {
  try {
    const parsedMessage = JSON.parse(message.toString());
    console.log('Received MQTT message for incident:', parsedMessage);

    const { incidentType, email, boardId, details } = parsedMessage;

    // Fetch user by email
    const user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
    if (!user) {
      console.error(`User with email ${email} not found.`);
      return;
    }

    // Fetch user settings
    const userSettings = await UserSettings.findOne({ username: email });
    if (!userSettings) {
      console.error(`User settings not found for email: ${email}`);
      return;
    }

    const isGuestMode = userSettings.settings.enableGuestMode;
    console.log(`Guest mode status for ${email}:`, isGuestMode);

    let phoneNumber;

    if (isGuestMode) {
      const guestProfile = await GuestProfile.findById(userSettings.settings.selectedGuestProfile);
      if (guestProfile && guestProfile.phoneNumber) {
        phoneNumber = guestProfile.phoneNumber;
      } else {
        console.error(`Guest profile or phone number not found for guest mode.`);
        return;
      }
    } else {
      if (user.numtel) {
        phoneNumber = user.numtel;
      } else {
        console.error(`Phone number not found for user: ${email}`);
        return;
      }
    }

    console.log(`Phone number for notification: ${phoneNumber}`);

    const timeOfIncident = new Date();

    // Save the incident to the database
    const newIncident = new Incident({
      incidentType,
      user: user._id, // Properly assign the user's ObjectId
      boardId,
      details,
      isGuestMode,
      guestProfileId: isGuestMode ? userSettings.settings.selectedGuestProfile : null,
      phoneNumber,
      timeOfIncident,
    });

    await newIncident.save();
    console.log('Incident saved successfully:', newIncident);

    // Trigger notification
    const notificationMessage = `Alert: ${incidentType} reported on board ${boardId}. Details: ${details}`;
    await axios.post(`http://localhost:4000/api/notifications/incidents/${newIncident._id}`, {
      message: notificationMessage,
    });

    console.log('Notification API triggered for incident:', newIncident._id);

  } catch (error) {
    console.error('Error processing MQTT message for incident:', error);
  }
});

module.exports = client;
