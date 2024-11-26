// statisticsService.js
const mongoose = require('mongoose');
const Telemetry = require('../models/Telemetry'); // Assuming telemetry data is stored here
const UserSettings = require('../models/UserSettings');
const Statistics = require('../models/Statistics'); // New model to store statistics
// Function to calculate distance traveled based on telemetry events
const haversine = require('haversine-distance');
const Accident = require('../models/Accident');
const User = require('../models/user');

// Parses coordinates from location values in telemetry events and supports both formats
function parseCoordinates(value) {
  // Try parsing as "Latitude: DDMM.MMMMM,N, Longitude: DDDMM.MMMMM,W" format
  const legacyLatMatch = value.match(/Latitude:\s*(\d{2})(\d+\.\d+),([NS])/);
  const legacyLonMatch = value.match(/Longitude:\s*(\d{3})(\d+\.\d+),([EW])/);

  if (legacyLatMatch && legacyLonMatch) {
    let lat = parseFloat(legacyLatMatch[1]) + parseFloat(legacyLatMatch[2]) / 60;
    let lon = parseFloat(legacyLonMatch[1]) + parseFloat(legacyLonMatch[2]) / 60;

    if (legacyLatMatch[3] === 'S') lat = -Math.abs(lat);
    if (legacyLonMatch[3] === 'W') lon = -Math.abs(lon);

    console.log(`Parsed coordinates (legacy format): ${lat}, ${lon}`);
    return { lat, lon };
  }

  // Try parsing as "Latitude: DD.DDDDD,N, Longitude: -DDD.DDDDD,W" format
  const newLatMatch = value.match(/Latitude:\s*(-?\d+\.\d+),/);
  const newLonMatch = value.match(/Longitude:\s*(-?\d+\.\d+)/);

  if (newLatMatch && newLonMatch) {
    let lat = parseFloat(newLatMatch[1]);
    let lon = parseFloat(newLonMatch[1]);

    if (value.includes('S')) lat = -Math.abs(lat);
    if (value.includes('W')) lon = -Math.abs(lon);

    console.log(`Parsed coordinates (new format): ${lat}, ${lon}`);
    return { lat, lon };
  }

  console.log(`Failed to parse coordinates from value: ${value}`);
  return null;
}

// Calculate cumulative distance traveled
async function calculateDistanceTraveled(userEmail, boardId) {
  const telemetryData = await Telemetry.findOne({ useremail: userEmail, boardid: boardId });
  
  if (!telemetryData || !telemetryData.events) {
    console.log(`No telemetry data found for user: ${userEmail}, board: ${boardId}`);
    return 0;
  }

  const locations = telemetryData.events
    .filter(event => event.type === 'location')
    .map(event => {
      const coord = parseCoordinates(event.value);
      console.log(`Parsed location for event ${event._id}: ${JSON.stringify(coord)}`);
      return coord;
    })
    .filter(coord => coord);

  if (locations.length < 2) {
    console.log(`Insufficient valid locations to calculate distance for user: ${userEmail}, board: ${boardId}`);
    return 0;
  }

  let totalDistance = 0;
  const DISTANCE_THRESHOLD = 10;

  for (let i = 1; i < locations.length; i++) {
    const prev = locations[i - 1];
    const curr = locations[i];
    const distance = haversine(prev, curr);

    console.log(`Distance from point ${i - 1} to ${i}: ${distance} meters`);
    if (distance >= DISTANCE_THRESHOLD) {
      totalDistance += distance;
    }
  }
  
  console.log(`Total distance traveled for user: ${userEmail}, board: ${boardId}: ${totalDistance / 1000} km`);
  return totalDistance / 1000;
}

//Speed calculations
//Average speed calc
const calculateAverageSpeed = async (useremail, boardid) => {
  // Find the telemetry document for the specified user and board
  const telemetryData = await Telemetry.findOne({ useremail, boardid });
  
  if (!telemetryData || !telemetryData.events) {
    console.log(`No telemetry data or events found for user: ${useremail}, board: ${boardid}`);
    return 0;
  }

  // Filter speed events and extract numeric speed values
  const speedEvents = telemetryData.events
    .filter(event => event.type === 'speed')
    .map(event => {
      const speedMatch = event.value.match(/Speed:\s*([\d.]+)\s*km\/h/);
      return speedMatch ? parseFloat(speedMatch[1]) : null;
    })
    .filter(speed => speed !== null); // Filter out any invalid speed values

  if (speedEvents.length === 0) {
    console.log(`No valid speed data for user: ${useremail}, board: ${boardid}`);
    return 0;
  }

  // Calculate average speed
  const totalSpeed = speedEvents.reduce((sum, speed) => sum + speed, 0);
  const averageSpeed = totalSpeed / speedEvents.length;

  console.log(`Calculated averageSpeed for user ${useremail}, board ${boardid}: ${averageSpeed}`);
  return averageSpeed;
};

// Function to calculate the maximum speed recorded
async function calculateMaxSpeed(useremail, boardid) {
  // Retrieve telemetry data for this user and board
  const telemetry = await Telemetry.findOne({ useremail, boardid });

  if (!telemetry || !telemetry.events) return 0;

  // Filter for speed events and extract numerical speed values
  const speeds = telemetry.events
    .filter(event => event.type === 'speed')
    .map(event => {
      const match = event.value.match(/Speed:\s*(\d+(\.\d+)?)\s*km\/h/);
      return match ? parseFloat(match[1]) : null;
    })
    .filter(speed => speed !== null); // Filter out any nulls

  // Find the maximum speed value or return 0 if no valid speed data is found
  return speeds.length > 0 ? Math.max(...speeds) : 0;
}

//Total ride duration
const calculateTotalRideDuration = async (useremail, boardid) => {
  const telemetry = await Telemetry.findOne({ useremail, boardid });

  if (!telemetry || !telemetry.events) {
    console.log('No telemetry data or events found for ride duration calculation');
    return 0;
  }

  // Filter for location events and sort them by timestamp
  const locationEvents = telemetry.events
    .filter(event => event.type === 'location')
    .sort((a, b) => new Date(a.when) - new Date(b.when));

  if (locationEvents.length < 2) {
    console.log('Not enough location events to calculate ride duration');
    return 0;
  }

  const rideDurationThreshold = 10 * 60 * 1000; // 10 minutes in milliseconds
  let totalRideDuration = 0;
  let rideStartTime = new Date(locationEvents[0].when);

  for (let i = 1; i < locationEvents.length; i++) {
    const currentEventTime = new Date(locationEvents[i].when);
    const timeDifference = currentEventTime - new Date(locationEvents[i - 1].when);

    if (timeDifference <= rideDurationThreshold) {
      // Continue the current ride
      totalRideDuration += timeDifference;
    } else {
      // Start a new ride
      rideStartTime = currentEventTime;
    }
  }

  // Convert totalRideDuration from milliseconds to hours
  const totalRideDurationHours = totalRideDuration / (1000 * 60 * 60);
  console.log(`Total ride duration for user: ${useremail}, board: ${boardid}: ${totalRideDurationHours.toFixed(2)} hours`);

  return totalRideDurationHours;
};

//Top Locations

// Calculate Top Locations
const calculateTopLocations = async (useremail, boardid) => {
  const telemetry = await Telemetry.findOne({ useremail, boardid });

  if (!telemetry || !telemetry.events) {
    console.log(`No telemetry data found for user: ${useremail}, board: ${boardid}`);
    return [];
  }

  const locations = telemetry.events
    .filter(event => event.type === 'location')
    .map(event => parseCoordinates(event.value))
    .filter(coord => coord);

  // Minimum distance (in meters) to consider points as part of the same location cluster
  const clusteringThreshold = 100;

  // Group locations within clustering threshold
  const clusters = [];
  locations.forEach(location => {
    let added = false;
    for (const cluster of clusters) {
      // Calculate distance from this location to the center of the cluster
      const clusterCenter = cluster.center;
      const distanceToCluster = haversine(clusterCenter, location);
      if (distanceToCluster <= clusteringThreshold) {
        cluster.locations.push(location);
        cluster.center = getClusterCenter(cluster.locations); // Recalculate cluster center
        cluster.count += 1;
        added = true;
        break;
      }
    }
    if (!added) {
      // Create a new cluster
      clusters.push({ center: location, locations: [location], count: 1 });
    }
  });

  // Sort clusters by visit count and select the top ones
  const topClusters = clusters
    .sort((a, b) => b.count - a.count)
    .slice(0, 5) // Take top 5 most visited clusters
    .map(cluster => ({
      latitude: cluster.center.lat,
      longitude: cluster.center.lon,
      visitCount: cluster.count,
    }));

  return topClusters;
};

// Utility function to calculate the center of a cluster
function getClusterCenter(locations) {
  const latSum = locations.reduce((sum, loc) => sum + loc.lat, 0);
  const lonSum = locations.reduce((sum, loc) => sum + loc.lon, 0);
  return {
    lat: latSum / locations.length,
    lon: lonSum / locations.length,
  };
}


//Guestmode stats
// Calculate guest mode statistics
async function calculateGuestModeStats(userId) {
  const userSettings = await UserSettings.findOne({ username: userId });

  if (!userSettings || !userSettings.settings.guestModeLogs) return { frequency: 0, totalDuration: 0 };

  const guestModeLogs = userSettings.settings.guestModeLogs;
  
  const frequency = guestModeLogs.length;
  
  const totalDuration = guestModeLogs.reduce((acc, log) => {
    if (log.activationTime && log.deactivationTime) {
      const duration = (log.deactivationTime - log.activationTime) / (1000 * 60); // Convert to minutes
      return acc + duration;
    }
    return acc;
  }, 0);

  return { frequency, totalDuration };
}

const calculateTotalAccidentsForBoard = async (userEmail, boardId) => {
  try {
    // Find the user by email to get the _id
    const user = await User.findOne({ email: { $regex: new RegExp(`^${userEmail}$`, 'i') } });

    if (!user) {
      console.error(`User with email ${userEmail} not found.`);
      return 0; // Return 0 accidents if the user is not found
    }

    console.log(`User found: ${user._id}`);

    // Count accidents for the specific board and user
    const totalAccidentsForBoard = await Accident.countDocuments({
      user: user._id,
      boardId: boardId, // Filter by the boardId
      isGuestMode: false, // Exclude guest mode accidents
    });

    console.log(`Accidents found for user ${user._id} on board ${boardId}: ${totalAccidentsForBoard}`);
    return totalAccidentsForBoard;
  } catch (error) {
    console.error('Error calculating total accidents for board:', error);
    throw error;
  }
};


//Updater
const updateStatistics = async () => {
  try {
    const telemetryUsers = await Telemetry.distinct('useremail');
    console.log('Telemetry Users:', telemetryUsers);

    for (const useremail of telemetryUsers) {
      if (!useremail) {
        console.log('Skipping telemetry entry with missing userEmail');
        continue;
      }

      const userTelemetryData = await Telemetry.find({ useremail });

      if (!userTelemetryData.length) {
        console.log(`No telemetry data found for user: ${useremail}`);
        continue;
      }

      const boardStats = [];

      for (const telemetry of userTelemetryData) {
        const boardid = telemetry.boardid;
        if (!boardid) {
          console.log(`Skipping telemetry entry for user: ${useremail} with missing boardid`);
          continue;
        }

        const distanceTraveled = await calculateDistanceTraveled(useremail, boardid);
        console.log(`Calculated distanceTraveled for user ${useremail}, board ${boardid}:`, distanceTraveled);
        // Calculate averageSpeed
        const averageSpeed = await calculateAverageSpeed(useremail, boardid);
        // Calculate maxSpeed
        const maxSpeed = await calculateMaxSpeed(useremail, boardid);
        // TRD
        const totalRideDuration = await calculateTotalRideDuration(useremail, boardid);
        // Example call in the updateStatistics function
        const topLocations = await calculateTopLocations(useremail, boardid);
        // Guestmode stats
        const guestModeStats = await calculateGuestModeStats(useremail);
        // Total accidents stat
        const accidentCount = await calculateTotalAccidentsForBoard(useremail, boardid);

        boardStats.push({
          boardid,
          distanceTraveled,
          averageSpeed,
          accidentCount,
          maxSpeed,
          totalRideDuration,
          topLocations,
          guestModeStats,
          updatedAt: new Date()
        });
      }

      // Save or update the Statistics document for this user and embedded board stats
      const updateResult = await Statistics.findOneAndUpdate(
        { useremail },
        { useremail, boards: boardStats },
        { upsert: true, new: true }
      );

      console.log(`Statistics updated for user: ${useremail}:`, updateResult);
    }
    console.log('All user statistics updated successfully');
  } catch (error) {
    console.error('Error updating statistics:', error);
  }
};








module.exports = { updateStatistics, calculateDistanceTraveled };
