const mqtt = require('mqtt');


// MQTT Broker Details
const MQTT_BROKER = "c4527dc1a0d9425f8b451446a7ebca7f.s1.eu.hivemq.cloud";
const MQTT_PORT = 8883;
const MQTT_TOPIC = "user/incidents"; // A dedicated topic for user incidents

// MQTT Connection Options
const options = {
  port: MQTT_PORT,
  clientId: `mqtt_user_incidents_${Math.random().toString(16).slice(3)}`,
  username: "board1",
  password: "Cacas1234",
  clean: true,
  reconnectPeriod: 1000,
};

// Connect to the MQTT broker
const client = mqtt.connect(`mqtts://${MQTT_BROKER}`, options);

client.on('connect', () => {
  console.log(`Connected to MQTT broker at ${MQTT_BROKER}:${MQTT_PORT}`);
  client.subscribe(MQTT_TOPIC, (err) => {
    if (err) {
      console.error(`Error subscribing to topic ${MQTT_TOPIC}:`, err);
    } else {
      console.log(`Subscribed to topic ${MQTT_TOPIC}`);
    }
  });
});
