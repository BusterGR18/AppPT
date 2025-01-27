// geoTypePublisher.js
const mqtt = require('mqtt');
const Board = require('../models/Board');
const GeoType = require('../models/GeoType');
const logger = require('./logger');



const MQTT_BROKER = "c4527dc1a0d9425f8b451446a7ebca7f.s1.eu.hivemq.cloud";
const MQTT_PORT = 8883;

const client = mqtt.connect({
  host: 'c4527dc1a0d9425f8b451446a7ebca7f.s1.eu.hivemq.cloud',
  port: 8883,
  protocol: 'mqtts',
  username: 'board1',
  password: 'Cacas1234'
});


client.on('connect', () => {
  logger.info('[GeoJson]Connected to MQTT broker for GeoType publishing.');
});

// Publish all GeoType data
const publishAllGeoTypeData = async () => {
  try {
    const geoTypeData = await GeoType.find();
    geoTypeData.forEach((geo) => {
      const payload = {
        useremail: geo.useremail, // Include user email
        geojsonData: geo.geojsonData, // Include the GeoJSON data
      };
      client.publish(`geojson/all`, JSON.stringify(payload));
    });
    logger.info('All GeoType data with metadata published to MQTT.');
  } catch (error) {
    logger.error('Error publishing all GeoType data:', error);
  }
};


// Publish GeoType data for a specific user
const publishGeoTypeForUser = async (userEmail) => {
  try {
    const userGeoTypeData = await GeoType.find({ useremail: userEmail });
    userGeoTypeData.forEach((geo) => {
      const payload = {
        useremail: geo.useremail, // Include user email
        geojsonData: geo.geojsonData, // Include the GeoJSON data
      };
      client.publish(`geojson/${userEmail}`, JSON.stringify(payload));
    });
    logger.info(`GeoType data for ${userEmail} published to MQTT.`);
  } catch (error) {
    logger.error(`Error publishing GeoType data for ${userEmail}:`, error);
  }
};


const publishGeoJSONForBoard = async (boardId) => {
  try {
    const board = await Board.findById(boardId).populate('geoTypes');
    if (!board) throw new Error('Board not found');

    const payload = {
      boardId: boardId,
      geoTypes: board.geoTypes.map((geoType) => ({
        useremail: geoType.useremail, // Include user email
        geojsonData: geoType.geojsonData, // Include the GeoJSON data
      })),
    };

    client.publish(`geojson/board/${boardId}`, JSON.stringify(payload));
    logger.info(`Published GeoJSON for board ${boardId}`);
  } catch (error) {
    logger.error('Error publishing GeoJSON for board:', error);
  }
};



module.exports = { publishAllGeoTypeData, publishGeoTypeForUser, publishGeoJSONForBoard };
