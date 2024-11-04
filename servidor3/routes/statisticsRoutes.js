// routes/statisticsRoutes.js

const express = require('express');
const { updateStatisticsNow, getAvailableStatistics, getUserStatistics } = require('../controllers/statisticsController');
const router = express.Router();
const { calculateDistanceTraveled } = require('../extras/statisticsService');

router.post('/update', updateStatisticsNow); // POST request for manual update

router.get('/available', getAvailableStatistics);
router.get('/user', getUserStatistics);

router.get('/distance', async (req, res) => {
    const { userEmail, boardId } = req.query;
    
    try {
      const distance = await calculateDistanceTraveled(userEmail, boardId);
      res.json({ distance });
    } catch (error) {
      console.error('Error calculating distance:', error);
      res.status(500).json({ error: 'Failed to calculate distance' });
    }
  });

module.exports = router;
