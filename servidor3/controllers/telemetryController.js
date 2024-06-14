const express = require('express');
const router = express.Router();
const Telemetry = require('../models/Telemetry'); 
const jwt = require('jsonwebtoken');

// Middleware to verify JWT and extract user email
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(500).json({ message: 'Failed to authenticate token' });

    req.userEmail = decoded.email; // Assuming the token contains the user email
    next();
  });
};

// Controller function to get the latest location for a specific useremail and boardid combo
const getLatestLocation = async (req, res) => {
    const { useremail, boardid } = req.params;

    try {
        const result = await Telemetry.aggregate([
            { $match: { 
                "location.useremail": useremail, 
                "location.boardid": boardid 
            }},
            { $unwind: "$location" },
            { $sort: { "location.events.when": -1 }},
            { $limit: 1 }
        ]);
        
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


// Controller function to get the latest battery status for a specific useremail and boardid combo
const getLatestBatteryStatus = async (req, res) => {
    const { useremail, boardid } = req.params;

    try {
        const result = await Telemetry.aggregate([
            { $match: { 
                "battery.useremail": useremail, 
                "battery.boardid": boardid 
            }},
            { $unwind: "$battery" },
            { $sort: { "battery.events.when": -1 }},
            { $limit: 1 }
        ]);
        
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

/*
// Route for getting the latest location for a specific useremail and boardid combo
router.get('/location/:useremail/:boardid', verifyToken, getLatestLocation);
// Route for getting the latest location for a specific useremail and boardid combo
router.get('/battery/:useremail/:boardid', verifyToken, getLatestBatteryStatus);
module.exports = router;
*/

const getBoardIDsForUser = async (req, res) => {
    const { useremail } = req.params;

    try {
        const telemetryData = await Telemetry.find({
            $or: [
                { "battery.useremail": useremail },
                { "speed.useremail": useremail },
                { "tilt.useremail": useremail },
                { "location.useremail": useremail }
            ]
        }, {
            "battery.boardid": 1,
            "speed.boardid": 1,
            "tilt.boardid": 1,
            "location.boardid": 1
        });

        // Extract unique boardIDs
        const boardIDs = new Set();
        telemetryData.forEach(data => {
            data.battery?.forEach(b => boardIDs.add(b.boardid));
            data.speed?.forEach(s => boardIDs.add(s.boardid));
            data.tilt?.forEach(t => boardIDs.add(t.boardid));
            data.location?.forEach(l => boardIDs.add(l.boardid));
        });

        res.json(Array.from(boardIDs));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


module.exports = {
    verifyToken,
    getLatestLocation,
    getLatestBatteryStatus,
    getBoardIDsForUser
};