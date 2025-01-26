//V2
const logger = require('./logger');
const mqtt = require('mqtt');
const { MongoClient } = require("mongodb");

// MQTT configuration
const deviceRoot = "board1/tele/#";

// MongoDB configuration
const username = encodeURIComponent("gusAdmin");
const password = encodeURIComponent("cacas1");
const authMechanism = "DEFAULT";
const uri = `mongodb://localhost:27017/`;
let client;
let collection;

// Function to initialize the telemetry listener
async function initTelemetryListener() {
    try {
        // Connect to MongoDB
        const mongoClient = new MongoClient(uri);
        await mongoClient.connect();
        //console.log("[Telemetry] Connected to MongoDB");

        // Access specific database and collection
        const database = mongoClient.db("authv1");
        collection = database.collection("telemetry");

        // Initialize MQTT client
        client = mqtt.connect({
            host: 'c4527dc1a0d9425f8b451446a7ebca7f.s1.eu.hivemq.cloud',
            port: 8883,
            protocol: 'mqtts',
            username: 'board1',
            password: 'Cacas1234'
        });

        client.on('connect', () => {
            logger.info("[Telemetry] Connected to MQTT broker.");
            //console.log(`[Telemetry] Subscribing to topic: ${deviceRoot}`);
            client.subscribe(deviceRoot, (err) => {
                if (err) {
                    logger.error("[Telemetry] Failed to subscribe to topic:", err);
                } else {
                    logger.info(`[Telemetry] Subscribed to topic: ${deviceRoot}`);
                }
            });
        });

        client.on('message', handleMessage);
        client.on('error', (err) => {
            logger.error("[Telemetry] MQTT error:", err);
        });

    } catch (error) {
        logger.error("[Telemetry] Error initializing telemetry listener:", error);
    }
}

// Function to handle incoming MQTT messages
function handleMessage(topic, message) {
    try {
        console.log(`[Telemetry] Received message on topic ${topic}: ${message.toString()}`);
        const parsedMessage = JSON.parse(message.toString());

        let document = {
            useremail: "unknown@example.com",
            boardid: "unknown_board",
            events: []
        };

        // Process parsed message (location, battery, speed)
        ['location', 'battery', 'speed'].forEach(type => {
            if (parsedMessage[type] && Array.isArray(parsedMessage[type])) {
                const eventData = parsedMessage[type][0];
                if (eventData.useremail) document.useremail = eventData.useremail;
                if (eventData.boardid) document.boardid = eventData.boardid;
                if (eventData.events && eventData.events.length > 0) {
                    const event = {
                        type,
                        value: eventData.events[0].value,
                        when: new Date(eventData.events[0].when)
                    };
                    document.events.push(event);
                    console.log(`[Telemetry] ${type} event added:`, event);
                }
            }
        });

        // Insert or update document in MongoDB
        if (document.events.length > 0) {
            console.log("[Telemetry] Inserting document into MongoDB:", document);
            collection.updateOne(
                { useremail: document.useremail, boardid: document.boardid },
                { $push: { events: { $each: document.events } } },
                { upsert: true },
                (err, res) => {
                    if (err) console.error("[Telemetry] Insert fail:", err);
                    else console.log("[Telemetry] Insert successful:", res);
                }
            );
        } else {
            console.log("[Telemetry] No valid events to insert into MongoDB.");
        }

    } catch (error) {
        logger.error("[Telemetry] Error processing message:", error);
    }
}

module.exports = { initTelemetryListener };
