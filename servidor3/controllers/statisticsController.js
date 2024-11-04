// statisticsController.js
const Statistics = require('../models/Statistics');
const { updateStatistics } = require('../extras/statisticsService'); // Service function for calculations

exports.updateStatisticsNow = async (req, res) => {
  try {
    await updateStatistics();
    res.status(200).json({ message: 'Statistics updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating statistics' });
  }
};


// This is an example and may need adjustments based on your actual schema
exports.getAvailableStatistics = async (req, res) => {
  try {
    // Fetch a sample document to extract fields dynamically
    const sampleStatistics = await Statistics.findOne({}, { _id: 0 }).lean();
    if (!sampleStatistics) {
      return res.status(404).json({ message: 'No statistics found.' });
    }

    // Extract keys from the sample statistics object, excluding certain fields
    const availableStatistics = Object.keys(sampleStatistics.boards[0]).filter(stat =>
      ['_id', 'updatedAt', 'boardid'].indexOf(stat) === -1
    );

    res.status(200).json(availableStatistics);
  } catch (error) {
    console.error('Error fetching available statistics:', error);
    res.status(500).json({ error: 'Error fetching available statistics' });
  }
};

// Get user statistics
exports.getUserStatistics = async (req, res) => {
  const { useremail } = req.query;
  try {
    const userStats = await Statistics.findOne({ useremail });
    if (!userStats) {
      return res.status(404).json({ error: 'No statistics found for this user.' });
    }
    res.status(200).json(userStats);
  } catch (error) {
    console.error('Error fetching user statistics:', error);
    res.status(500).json({ error: 'Error fetching user statistics' });
  }
};