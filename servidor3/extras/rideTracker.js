const mqtt = require('mqtt');
const Ride = require('../models/Ride');
const logger = require('./logger');
const Telemetry = require('../models/Telemetry');

const MQTT_BROKER = "c4527dc1a0d9425f8b451446a7ebca7f.s1.eu.hivemq.cloud";
const client = mqtt.connect(`mqtts://${MQTT_BROKER}`, {
  port: 8883,
  username: 'board1',
  password: 'Cacas1234',
});

// Haversine Formula to calculate distance between two points
const haversineDistance = (coords1, coords2) => {
  const R = 6371; // Earth’s radius in km
  const dLat = (coords2.lat - coords1.lat) * (Math.PI / 180);
  const dLon = (coords2.lng - coords1.lng) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(coords1.lat * (Math.PI / 180)) * Math.cos(coords2.lat * (Math.PI / 180)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

client.on('connect', () => {
  logger.info('[Tracker] Connected to MQTT broker for Ride Tracking.')
  //console.log('Connected to MQTT broker for Ride Tracking.');
  client.subscribe("board1/tele/#");
});

//MessageV1
/*
client.on('message', async (topic, message) => {
  try {
    const parsedData = JSON.parse(message.toString());
    const { boardid, useremail, events } = parsedData;
    const locationEvent = events.find(e => e.type === 'location');

    if (!locationEvent) return;

    const newLocation = {
      lat: parseFloat(locationEvent.value.split(',')[0].split(': ')[1]),
      lng: parseFloat(locationEvent.value.split(',')[1].split(': ')[1]),
      timestamp: new Date(locationEvent.when),
    };

    // Find last ride for the board
    let lastRide = await Ride.findOne({ boardId: boardid, endTime: null }).sort({ startTime: -1 });

    if (!lastRide) {
      // Start new ride if none exists
      lastRide = await new Ride({
        boardId: boardid,
        userEmail: useremail,
        startTime: new Date(),
        locations: [newLocation],
      }).save();
      return;
    }

    // Calculate movement distance
    const lastLocation = lastRide.locations[lastRide.locations.length - 1];
    const distanceMoved = haversineDistance(lastLocation, newLocation);

    if (distanceMoved > 0.02) { // More than 20m movement
      lastRide.totalDistance += distanceMoved;
      lastRide.maxSpeed = Math.max(lastRide.maxSpeed, parseFloat(events.find(e => e.type === 'speed')?.value.split(' ')[1] || 0));
      lastRide.locations.push(newLocation);
      await lastRide.save();
    } else if (new Date() - new Date(lastLocation.timestamp) > 15 * 60 * 1000) {
      // If idle for >15 min, finalize ride
      lastRide.endTime = new Date();
      await lastRide.save();
    }
  } catch (error) {
    console.error('Error processing ride data:', error);
  }
});
*/
//V2 MEssage
client.on('message', async (topic, message) => {
  try {
    const parsedData = JSON.parse(message.toString());

    // Detect type of telemetry by MQTT topic or payload
    let eventArray;

    if (parsedData.location) {
      eventArray = parsedData.location[0];
    } else if (parsedData.battery) {
      eventArray = parsedData.battery[0];
    } else if (parsedData.speed) {
      eventArray = parsedData.speed[0];
    } else {
      return; // Ignore unknown messages
    }

    const { boardid, useremail, events } = eventArray;

    const locationEvent = events?.find(e => e.type === 'location' || topic.includes('location'));

    if (!locationEvent) return;

    const newLocation = {
      lat: parseFloat(locationEvent.value.split(',')[0].split(': ')[1]),
      lng: parseFloat(locationEvent.value.split(',')[1].split(': ')[1]),
      timestamp: new Date(locationEvent.when),
    };

    let lastRide = await Ride.findOne({ boardId: boardid, endTime: null }).sort({ startTime: -1 });

    if (!lastRide) {
      lastRide = await new Ride({
        boardId: boardid,
        userEmail: useremail,
        startTime: new Date(),
        locations: [newLocation],
      }).save();
      return;
    }

    const lastLocation = lastRide.locations[lastRide.locations.length - 1];
    const distanceMoved = haversineDistance(lastLocation, newLocation);

    if (distanceMoved > 0.02) {
      lastRide.totalDistance += distanceMoved;
      lastRide.maxSpeed = Math.max(lastRide.maxSpeed, parseFloat(events.find(e => e.type === 'speed')?.value.split(' ')[1] || 0));
      lastRide.locations.push(newLocation);
      await lastRide.save();
    } else if (new Date() - new Date(lastLocation.timestamp) > 15 * 60 * 1000) {
      lastRide.endTime = new Date();
      await lastRide.save();
    }

  } catch (error) {
    console.error('Error processing ride data:', error);
  }
});
