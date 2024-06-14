const mqtt = require('mqtt');
const { MongoClient } = require("mongodb");
const debug = require('debug')('pruebacombinada');

// MQTT configuration
const deviceRoot = "board1/tele/#";
let client;

// MongoDB configuration
const username = encodeURIComponent("gusAdmin");
const password = encodeURIComponent("cacas1");
const authMechanism = "DEFAULT";
const uri = `mongodb://${username}:${password}@localhost:27017/?authMechanism=${authMechanism}`;
let collection;

// Create a new MongoClient
const mongoClient = new MongoClient(uri);

// Function to connect to MongoDB and start MQTT
async function run() {
    try {
        // Connect to MongoDB
        await mongoClient.connect();
        debug("Connected to MongoDB");

        // Access specific database and collection
        const database = mongoClient.db("authv1");
        collection = database.collection("telemetry");

        // Establish MQTT connection
        client = mqtt.connect({
            host: 'c4527dc1a0d9425f8b451446a7ebca7f.s1.eu.hivemq.cloud',
            port: 8883,
            protocol: 'mqtts',
            username: 'board1',
            password: 'Cacas1234'
        });

        client.on('connect', () => {
            debug("Connected to MQTT broker.");
            debug(`Subscribing to topic: ${deviceRoot}`);
            client.subscribe(deviceRoot, (err) => {
                if (err) {
                    debug("Failed to subscribe to topic:", err);
                } else {
                    debug(`Subscribed to topic: ${deviceRoot}`);
                }
            });
        });

        client.on('message', handleMessage);
        client.on('error', (err) => {
            debug("MQTT error:", err);
        });

    } catch (error) {
        debug("Error connecting to MongoDB:", error);
    }
}

// Function to handle MQTT messages
function handleMessage(topic, message) {
    try {
        debug(`Received message on topic ${topic}: ${message.toString()}`);
        const parsedMessage = JSON.parse(message.toString());
        debug("Parsed message:", parsedMessage);

        let document = {
            useremail: "unknown@example.com",
            boardid: "unknown_board",
            events: []
        };

        // Process location data if available
        if (parsedMessage.location && Array.isArray(parsedMessage.location)) {
            const locationData = parsedMessage.location[0];
            if (locationData.useremail) {
                document.useremail = locationData.useremail;
            }
            if (locationData.boardid) {
                document.boardid = locationData.boardid;
            }
            if (locationData.events && locationData.events.length > 0) {
                const locationEvent = {
                    type: 'location',
                    value: `${locationData.events[0].value}`,
                    when: new Date(locationData.events[0].when)
                };
                document.events.push(locationEvent);
                debug("Location event added:", locationEvent);
            }
        }

        // Process battery data if available
        if (parsedMessage.battery && Array.isArray(parsedMessage.battery)) {
            const batteryData = parsedMessage.battery[0];
            if (batteryData.useremail) {
                document.useremail = batteryData.useremail;
            }
            if (batteryData.boardid) {
                document.boardid = batteryData.boardid;
            }
            if (batteryData.events && batteryData.events.length > 0) {
                const batteryEvent = {
                    type: 'battery',
                    value: batteryData.events[0].value,
                    when: new Date(batteryData.events[0].when)
                };
                document.events.push(batteryEvent);
                debug("Battery event added:", batteryEvent);
            }
        }


        // Process speed data if available
        if (parsedMessage.speed && Array.isArray(parsedMessage.speed)) {
            const speedData = parsedMessage.speed[0];
            if (speedData.useremail) {
                document.useremail = speedData.useremail;
            }
            if (speedData.boardid) {
                document.boardid = speedData.boardid;
            }
            if (speedData.events && speedData.events.length > 0) {
                const speedEvent = {
                    type: 'speed',
                    value: speedData.events[0].value,
                    when: new Date(speedData.events[0].when)
                };
                document.events.push(speedEvent);
                debug("Speed event added:", speedEvent);
            }
        }

        // Insert document into MongoDB if events are present
        if (document.events.length > 0) {
            debug("Inserting document into MongoDB:", document);
            collection.updateOne(
                { useremail: document.useremail, boardid: document.boardid },
                { $push: { events: { $each: document.events } } },
                { upsert: true },
                (err, res) => {
                    if (err) {
                        debug("Insert fail:", err); // Improve error handling
                    } else {
                        debug("Insert successful:", res);
                    }
                }
            );
        } else {
            debug("No valid events to insert into MongoDB.");
        }

    } catch (error) {
        debug("Error processing message:", error);
    }
}

// Call the run function to start the process
run().catch(console.dir);
