const mongoose = require('mongoose');
mongoose.pluralize(null);

const eventSchema = new mongoose.Schema({
    type: String,
    value: String,
    when: Date
});

const telemetrySchema = new mongoose.Schema({
    boardid: String,
    useremail: String,
    events: [eventSchema]
});

const Telemetry = mongoose.model('telemetry', telemetrySchema);
//mongoose.model("employee", employeeSchema, { collection: 'myEmployee' } ) 

module.exports = Telemetry;
