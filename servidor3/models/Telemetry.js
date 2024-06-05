const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    value: String,
    when: Date
});

const mainSchema = new mongoose.Schema({
    battery: [{
        _id: String,
        useremail: String,
        boardid: String,
        events: [eventSchema]
    }],
    speed: [{
        _id: String,
        useremail: String,
        boardid: String,
        events: [eventSchema]
    }],
    tilt: [{
        _id: String,
        useremail: String,
        boardid: String,
        events: [eventSchema]
    }],
    location: [{
        _id: String,
        useremail: String,
        boardid: String,
        events: [eventSchema]
    }]
});

const Telemetry = mongoose.model('Telemetry', mainSchema);

module.exports = Telemetry;
