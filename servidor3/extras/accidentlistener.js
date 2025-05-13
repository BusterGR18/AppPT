//V1
/*
  const mqtt = require('mqtt');
  const Accident = require('../models/Accident');
  const User = require('../models/user');
  const GuestProfile = require('../models/GuestProfile');
  const UserSettings = require('../models/UserSettings');
  const Contact = require('../models/Contact');
  
  // Replace these with your details
  const MQTT_BROKER = "c4527dc1a0d9425f8b451446a7ebca7f.s1.eu.hivemq.cloud";
  const MQTT_PORT = 8883;
  const MQTT_TOPIC = "accidents/boards/all";
  
  // MQTT connection options
  const options = {
    port: MQTT_PORT,
    clientId: `mqtt_${Math.random().toString(16).slice(3)}`,
    username: "board1", // If your MQTT broker requires authentication
    password: "Cacas1234",
    clean: true, // Ensure a clean session
    reconnectPeriod: 1000, // Reconnect every 1 second if disconnected
  };
  
  const processAccidentNotification = async (email, isGuestMode, guestProfileId) => {
    try {
      if (isGuestMode) {
        // Fetch guest profile contacts in guest mode
        const guestProfile = await GuestProfile.findById(guestProfileId);
        if (!guestProfile) {
          console.error(`Guest profile with ID ${guestProfileId} not found.`);
          return [];
        }
        return guestProfile.contacts || [];
      } else {
        // Fetch user settings including excluded contacts
        const userSettings = await UserSettings.findOne({ username: email }).populate('excludedContacts');
        if (!userSettings) {
          console.error('No user settings found for email:', email);
          return [];
        }
  
        // Fetch all contacts for the user
        const allContacts = await Contact.find({ useremail: email });
  
        // Filter out excluded contacts
        const notifiedContacts = allContacts.filter(
          (contact) =>
            !userSettings.excludedContacts.some((excluded) => excluded._id.equals(contact._id))
        );
  
        return notifiedContacts;
      }
    } catch (error) {
      console.error('Error processing accident notification:', error);
      return [];
    }
  };
  
  // Connect to the broker
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
      console.log('Received MQTT message:', parsedMessage);
  
      const { accidentType, email, boardId, isGuestMode, guestProfileId, location, timeOfAccident } = parsedMessage;
  
      console.log('Querying user with email:', email);
      const user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
      console.log('Fetched user:', user);
  
      if (!user) {
        console.error(`User with email ${email} not found.`);
        return;
      }
  
      // Determine notified contacts
      const notifiedContacts = await processAccidentNotification(email, isGuestMode, guestProfileId);
  
      if (!notifiedContacts.length) {
        console.warn(`No contacts to notify for email: ${email}`);
      }
  
      // Create the new accident record
      const newAccident = new Accident({
        accidentType,
        user: user._id,
        boardId,
        isGuestMode,
        guestProfileId,
        location,
        timeOfAccident,
        notifiedContacts,
      });
  
      // Save the accident to MongoDB
      await newAccident.save();
      console.log('Accident saved successfully:', newAccident);
  
      // TODO: Call the notification API here if needed
    } catch (error) {
      console.error('Error processing MQTT message:', error);
    }
  });
  
  module.exports = client;
  */

  //V2
  /*
  const mqtt = require('mqtt');
  const Accident = require('../models/Accident');
  const User = require('../models/user');
  const GuestProfile = require('../models/GuestProfile');
  const UserSettings = require('../models/UserSettings');
  const Contact = require('../models/Contact');
  
  // Replace these with your details
  const MQTT_BROKER = "c4527dc1a0d9425f8b451446a7ebca7f.s1.eu.hivemq.cloud";
  const MQTT_PORT = 8883;
  const MQTT_TOPIC = "accidents/boards/all";
  
  // MQTT connection options
  const options = {
    port: MQTT_PORT,
    clientId: `mqtt_${Math.random().toString(16).slice(3)}`,
    username: "board1", // If your MQTT broker requires authentication
    password: "Cacas1234",
    clean: true, // Ensure a clean session
    reconnectPeriod: 1000, // Reconnect every 1 second if disconnected
  };
  
  const processAccidentNotification = async (email) => {
    try {
      // Fetch user settings
      const userSettings = await UserSettings.findOne({ username: email });
      if (!userSettings) {
        console.error(`No user settings found for email: ${email}`);
        return [];
      }
  
      // Fetch all contacts for the user
      const allContacts = await Contact.find({ useremail: email });
  
      // Filter out excluded contacts
      const excludedContactIds = userSettings.settings.excludedContacts || []; // Use stored ObjectIDs
      const notifiedContacts = allContacts.filter(
        (contact) => !excludedContactIds.some((excludedId) => excludedId.equals(contact._id))
      );
  
      console.log('Notified contacts:', notifiedContacts);
      return notifiedContacts;
    } catch (error) {
      console.error('Error processing accident notification:', error);
      return [];
    }
  };
  
  
  
  // Connect to the broker
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
      console.log('Received MQTT message:', parsedMessage);
  
      const { accidentType, email, boardId, isGuestMode, guestProfileId, location, timeOfAccident } = parsedMessage;
  
      // Fetch user by email
      const user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
      if (!user) {
        console.error(`User with email ${email} not found.`);
        return;
      }
  
      // Determine notified contacts based on guest mode
      let notifiedContacts = [];
      if (isGuestMode) {
        const guestProfile = await GuestProfile.findById(guestProfileId).select('contacts');
        notifiedContacts = guestProfile ? guestProfile.contacts : [];
      } else {
        notifiedContacts = await processAccidentNotification(email);
      }
  
      // Create the new accident record
      const newAccident = new Accident({
        accidentType,
        user: user._id,
        boardId,
        isGuestMode,
        guestProfileId: isGuestMode ? guestProfileId : null,
        location,
        timeOfAccident,
        notifiedContacts,
      });
  
      // Save the accident to MongoDB
      await newAccident.save();
      console.log('Accident saved successfully:', newAccident);
  
      // TODO: Trigger notification API
    } catch (error) {
      console.error('Error processing MQTT message:', error);
    }
  });
  
  
  
  module.exports = client;
*/
//V3
const logger = require('./logger');
const mqtt = require('mqtt');
const Accident = require('../models/Accident');
const User = require('../models/user');
const GuestProfile = require('../models/GuestProfile');
const UserSettings = require('../models/UserSettings');
const Contact = require('../models/Contact');
const axios = require('axios');

const MQTT_BROKER = "c4527dc1a0d9425f8b451446a7ebca7f.s1.eu.hivemq.cloud";
const MQTT_PORT = 8883;
const MQTT_TOPIC = "accidents/boards/all";

const options = {
  port: MQTT_PORT,
  clientId: `mqtt_${Math.random().toString(16).slice(3)}`,
  username: "board1",
  password: "Cacas1234",
  clean: true,
  reconnectPeriod: 1000,
};

const processAccidentNotification = async (email) => {
  try {
    const userSettings = await UserSettings.findOne({ username: email });
    if (!userSettings) {
      console.error('No user settings found for email:', email);
      return [];
    }

    const allContacts = await Contact.find({ useremail: email });
    const notifiedContacts = allContacts.filter(
      (contact) =>
        !userSettings.settings.excludedContacts.some(
          (excluded) => excluded.equals(contact._id)
        )
    );

    console.log('Notified contacts:', notifiedContacts);
    return notifiedContacts;
  } catch (error) {
    console.error('Error processing accident notification:', error);
    return [];
  }
};

const client = mqtt.connect(`mqtts://${MQTT_BROKER}`, options);

client.on('connect', () => {
  logger.info(`[Accident] Connected to MQTT broker at ${MQTT_BROKER}:${MQTT_PORT}`);
  client.subscribe(MQTT_TOPIC, (err) => {
    if (err) {
      console.error(`Error subscribing to topic ${MQTT_TOPIC}:`, err);
    } else {
      logger.info(`[Accident] Subscribed to topic ${MQTT_TOPIC}`);
    }
  });
});

client.on('message', async (topic, message) => {
  try {
    const parsedMessage = JSON.parse(message.toString());
    console.log('Received MQTT message:', parsedMessage);

    const { accidentType, email, boardId, location } = parsedMessage;

    // Fetch the user by email
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

    let notifiedContacts = [];
    if (isGuestMode) {
      const guestProfile = await GuestProfile.findById(userSettings.settings.selectedGuestProfile).select('contacts');
      if (guestProfile) {
        // Map guest profile contacts to match Accident schema
        notifiedContacts = guestProfile.contacts.map((contact) => ({
          alias: contact.name, // Map `name` to `alias`
          number: contact.phoneNumber, // Map `phoneNumber` to `number`
        }));
      }
    } else {
      notifiedContacts = await processAccidentNotification(email);
    }

    const timeOfAccident = new Date();

    const newAccident = new Accident({
      accidentType,
      user: user._id,
      boardId,
      isGuestMode,
      guestProfileId: isGuestMode ? userSettings.settings.selectedGuestProfile : null,
      notifiedContacts,
      location,
      timeOfAccident,
    });

    await newAccident.save();
    console.log('Accident saved successfully:', newAccident);

    // TODO: Call the notification API here if needed
    //Docker
    await axios.post(`http://backend:4000/api/notifications/${newAccident._id}`);
    //Dev
    //await axios.post(`http://localhost:4000/api/notifications/${newAccident._id}`);
    console.log('Notification API triggered for accident:', newAccident._id);

  } catch (error) {
    console.error('Error processing MQTT message:', error);
  }
});


module.exports = client;
