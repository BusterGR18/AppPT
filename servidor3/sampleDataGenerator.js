const mongoose = require('mongoose');
const Telemetry = require('./models/Telemetry'); // Update path if necessary
const faker = require('@faker-js/faker').faker; // Adjust import for latest faker version

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/authv1', { useNewUrlParser: true, useUnifiedTopology: true });

const userEmail = "user@example.com";
const boardId = "board123";

const generateRandomTelemetryData = () => {
  const newEvents = [];

  // Generating realistic location data with slight variation
  const latitudeBase = 19.3349;
  const longitudeBase = -99.1062;

  for (let i = 0; i < 10; i++) {
    const latitude = latitudeBase + faker.number.float({ min: -0.0005, max: 0.0005, precision: 0.000001 });
    const longitude = longitudeBase + faker.number.float({ min: -0.0005, max: 0.0005, precision: 0.000001 });
    newEvents.push({
      type: "location",
      value: `Latitude: ${latitude.toFixed(6)},N, Longitude: ${longitude.toFixed(6)},W`,
      when: faker.date.recent()
    });
  }

  // Generating speed data with more variation
  for (let i = 0; i < 5; i++) {
    const speed = faker.number.float({ min: 10, max: 120, precision: 0.1 });
    newEvents.push({
      type: "speed",
      value: `Speed: ${speed.toFixed(1)} km/h`,
      when: faker.date.recent()
    });
  }

  return newEvents;
};

const appendTelemetryData = async () => {
  try {
    const telemetryDoc = await Telemetry.findOneAndUpdate(
      { useremail: userEmail, boardid: boardId },
      { $push: { events: { $each: generateRandomTelemetryData() } } },
      { upsert: true, new: true }
    );

    console.log("Telemetry data appended successfully:", telemetryDoc);
  } catch (error) {
    console.error("Error appending telemetry data:", error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the function
appendTelemetryData();
