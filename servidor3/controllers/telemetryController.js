// telemetryController.js

const Telemetry = require('../models/Telemetry');

// Controller function to get the latest location for a specific useremail and boardid combo
const getLatestLocation = async (req, res) => {
    const { useremail, boardid } = req.params;

    try {
        const result = await Telemetry.aggregate([
            { $match: { 
                useremail, 
                boardid 
            }},
            { $unwind: "$events" },
            { $match: { "events.type": "location" }},
            { $sort: { "events.when": -1 }},
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
                useremail, 
                boardid 
            }},
            { $unwind: "$events" },
            { $match: { "events.type": "battery" }},
            { $sort: { "events.when": -1 }},
            { $limit: 1 }
        ]);

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Controller function to get boardIDs for a specific useremail
const getBoardIDsForUser = async (req, res) => {
    const { useremail } = req.params;

    try {
        const telemetryData = await Telemetry.find({ useremail }, { boardid: 1 });

        // Extract unique boardIDs
        const boardIDs = new Set(telemetryData.map(data => data.boardid));

        res.json(Array.from(boardIDs));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    getLatestLocation,
    getLatestBatteryStatus,
    getBoardIDsForUser
};
