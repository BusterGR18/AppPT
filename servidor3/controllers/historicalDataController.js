// controllers/historicalDataController.js
const HistoricalData = require('../models/HistoricalData');
const Statistics = require('../models/Statistics');

// Function to fetch historical data for a user, board, and optional date range
exports.getHistoricalData = async (req, res) => {
  const { userEmail, boardId, range, startDate, endDate } = req.query;

  if (!userEmail || !boardId || (!range && (!startDate || !endDate))) {
    return res.status(400).json({ error: 'Missing required query parameters' });
  }

  try {
    let dateRange;

    // Check if range is provided; if not, use startDate and endDate
    if (range) {
      dateRange = getDateRange(range);
      if (!dateRange) {
        return res.status(400).json({ error: 'Invalid date range parameter' });
      }
    } else {
      dateRange = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    // Fetch historical data within the specified date range
    const historicalData = await HistoricalData.find({
      userEmail,
      boardId,
      date: { $gte: new Date(startDate), $lte: new Date(endDate) }  // Use "date" instead of "timestamp"
    }).sort({ date: 1 });// Sort by timestamp for chronological display

    res.status(200).json(historicalData);
  } catch (error) {
    console.error("Error fetching historical data:", error);
    res.status(500).json({ error: 'Error fetching historical data' });
  }
};

// Helper function to get date range
function getDateRange(range) {
  const currentDate = new Date();
  switch (range) {
    case '7d': 
      return new Date(currentDate.setDate(currentDate.getDate() - 7));
    case '30d': 
      return new Date(currentDate.setDate(currentDate.getDate() - 30));
    case '3m': 
      return new Date(currentDate.setMonth(currentDate.getMonth() - 3));
    case '1y': 
      return new Date(currentDate.setFullYear(currentDate.getFullYear() - 1));
    default: 
      return null; // Return null if the range parameter is invalid
  }
}
  

// Function to save daily snapshot of statistics to HistoricalData
exports.saveDailySnapshot = async () => {
  try {
    const allStats = await Statistics.find();
    for (const stat of allStats) {
      for (const board of stat.boards) {
        const historicalData = new HistoricalData({
          userEmail: stat.useremail,
          boardId: board.boardid,
          data: {
            distanceTraveled: board.distanceTraveled,
            averageSpeed: board.averageSpeed,
            totalRideDuration: board.totalRideDuration,
            accidentCount: board.accidentCount,
            maxSpeed: board.maxSpeed,
            guestModeStats: board.guestModeStats,
            topLocations: board.topLocations,
          },
        });
        await historicalData.save();
      }
    }
    console.log("Historical data snapshot saved successfully.");
  } catch (error) {
    console.error("Error saving historical snapshot:", error);
  }
};

exports.manualSnapshot = async (req, res) => {
    try {
      const allStats = await Statistics.find();
      const snapshots = [];
  
      for (const stat of allStats) {
        for (const board of stat.boards) {
          const historicalData = new HistoricalData({
            userEmail: stat.useremail,
            boardId: board.boardid,
            data: {
              distanceTraveled: board.distanceTraveled,
              averageSpeed: board.averageSpeed,
              totalRideDuration: board.totalRideDuration,
              accidentCount: board.accidentCount,
              maxSpeed: board.maxSpeed,
              guestModeStats: board.guestModeStats,
              topLocations: board.topLocations,
            },
          });
          snapshots.push(historicalData);
        }
      }
  
      // Save all snapshots in one go
      await HistoricalData.insertMany(snapshots);
      res.status(200).json({ message: 'Manual snapshot saved successfully.' });
    } catch (error) {
      console.error('Error creating manual snapshot:', error);
      res.status(500).json({ error: 'Error creating manual snapshot.' });
    }
  };