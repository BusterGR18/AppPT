// sampleDataGenerator.js
const mongoose = require('mongoose');
const Telemetry = require('./models/Telemetry'); // Adjust the path as necessary
const faker = require('faker');

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/authv1', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const generateRandomTelemetryData = async (userEmail, boardId, numEntries = 50) => {
  try {
    const events = [];
    let baseLatitude = 19.334991; // Example starting coordinates
    let baseLongitude = -99.106180;
    let baseSpeed = 10; // Starting speed in km/h
    let baseTime = new Date();

    for (let i = 0; i < numEntries; i++) {
      // Simulate location changes
      const randomLatChange = faker.datatype.float({ min: -0.0001, max: 0.0001 });
      const randomLongChange = faker.datatype.float({ min: -0.0001, max: 0.0001 });
      baseLatitude += randomLatChange;
      baseLongitude += randomLongChange;

      // Generate location event
      events.push({
        type: 'location',
        value: `Latitude: ${baseLatitude.toFixed(6)},N, Longitude: ${baseLongitude.toFixed(6)},W`,
        when: new Date(baseTime),
      });

      // Generate speed event with slight variation
      baseSpeed += faker.datatype.float({ min: -2, max: 2 });
      if (baseSpeed < 0) baseSpeed = 0; // Ensure speed doesn't go below 0

      events.push({
        type: 'speed',
        value: `Speed: ${baseSpeed.toFixed(1)} km/h`,
        when: new Date(baseTime),
      });

      // Increment time by random 30-90 seconds
      baseTime.setSeconds(baseTime.getSeconds() + faker.datatype.number({ min: 30, max: 90 }));
    }

    // Insert telemetry document with events for the specified user and board
    const telemetryEntry = new Telemetry({
      useremail: userEmail,
      boardid: boardId,
      events,
    });

    await telemetryEntry.save();
    console.log(`Inserted ${numEntries} telemetry events for user ${userEmail} and board ${boardId}`);
  } catch (error) {
    console.error('Error generating sample telemetry data:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the function with sample parameters
generateRandomTelemetryData('user@example.com', 'board123', 50);
