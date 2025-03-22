const Ride = require('../models/Ride');

// Get all rides for a user
exports.getUserRides = async (req, res) => {
  try {
    const { userEmail } = req.query;
    if (!userEmail) return res.status(400).json({ message: "User email is required." });

    const rides = await Ride.find({ userEmail }).sort({ startTime: -1 });
    res.status(200).json(rides);
  } catch (error) {
    console.error("Error fetching user rides:", error);
    res.status(500).json({ message: "Error fetching rides.", error });
  }
};

// Get all rides for a specific board
exports.getBoardRides = async (req, res) => {
  try {
    const { boardId } = req.params;
    const rides = await Ride.find({ boardId }).sort({ startTime: -1 });

    res.status(200).json(rides);
  } catch (error) {
    console.error("Error fetching board rides:", error);
    res.status(500).json({ message: "Error fetching board rides.", error });
  }
};

// Get a specific ride by ID
exports.getRideById = async (req, res) => {
  try {
    const { rideId } = req.params;
    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ message: "Ride not found." });

    res.status(200).json(ride);
  } catch (error) {
    console.error("Error fetching ride:", error);
    res.status(500).json({ message: "Error fetching ride.", error });
  }
};

// Delete a ride by ID (optional)
exports.deleteRide = async (req, res) => {
  try {
    const { rideId } = req.params;
    const deletedRide = await Ride.findByIdAndDelete(rideId);
    if (!deletedRide) return res.status(404).json({ message: "Ride not found." });

    res.status(200).json({ message: "Ride deleted successfully.", deletedRide });
  } catch (error) {
    console.error("Error deleting ride:", error);
    res.status(500).json({ message: "Error deleting ride.", error });
  }
};

// Get ride statistics for a user
exports.getRideStats = async (req, res) => {
  try {
    const { userEmail } = req.query;
    if (!userEmail) return res.status(400).json({ message: "User email is required." });

    const rides = await Ride.find({ userEmail });

    const totalDistance = rides.reduce((sum, ride) => sum + ride.totalDistance, 0);
    const totalTime = rides.reduce((sum, ride) => sum + ((new Date(ride.endTime || new Date()) - new Date(ride.startTime)) / 3600000), 0);
    const longestRide = rides.length ? Math.max(...rides.map(ride => ride.totalDistance)) : 0;
    const fastestSpeed = rides.length ? Math.max(...rides.map(ride => ride.maxSpeed)) : 0;

    res.status(200).json({
      totalRides: rides.length,
      totalDistance,
      totalTime,
      longestRide,
      fastestSpeed,
    });
  } catch (error) {
    console.error("Error fetching ride statistics:", error);
    res.status(500).json({ message: "Error fetching ride statistics.", error });
  }
};
