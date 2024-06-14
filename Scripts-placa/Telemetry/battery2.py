import time
import subprocess
import paho.mqtt.client as mqtt
import json
from datetime import datetime

# MQTT Configuration
MQTT_BROKER = "c4527dc1a0d9425f8b451446a7ebca7f.s1.eu.hivemq.cloud"
MQTT_PORT = 8883  # Default port for MQTT over SSL
MQTT_TOPIC = "board1/tele/battery"  # Replace with your topic
MQTT_CLIENT_ID = "board11"  # Replace with your client ID
MQTT_USERNAME = "board1"  # Replace with your username
MQTT_PASSWORD = "Cacas1234"  # Replace with your password

# MQTT Client Setup
client = mqtt.Client(MQTT_CLIENT_ID)
client.username_pw_set(MQTT_USERNAME, MQTT_PASSWORD)
client.tls_set()  # Enable TLS/SSL

def on_connect(client, userdata, flags, rc):
    print(f"Connected with result code {rc}")

client.on_connect = on_connect
client.connect(MQTT_BROKER, MQTT_PORT, 60)
client.loop_start()

def get_battery_level():
    try:
        result = subprocess.run(["power-dock2", "-p"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        output = result.stdout.decode('utf-8').strip()
        output_lines = output.splitlines()
        battery_level_line = output_lines[1]  # Assuming the battery level is on the second line
        battery_percent = battery_level_line.split(':')[1].strip()  # Extract the percentage
        return battery_percent
    except Exception as e:
        print(f"Error retrieving battery level: {e}")
        return None

def create_mqtt_message(battery_percent):
    message = {
        "battery": [{
            "_id": "unique_id",  # Replace with a unique identifier
            "useremail": "user@example.com",  # Replace with the user's email
            "boardid": "board123",  # Replace with the board ID
            "events": [{
                "value": f"Battery Level Percent: {battery_percent}",
                "when": datetime.utcnow().isoformat() + 'Z'
            }]
        }]
    }
    return json.dumps(message)

# Main loop to publish battery level percentage
try:
    while True:
        battery_percent = get_battery_level()
        if battery_percent is not None:
            mqtt_message = create_mqtt_message(battery_percent)
            client.publish(MQTT_TOPIC, mqtt_message)
        time.sleep(30)  # Sleep for 30 seconds before checking again

except KeyboardInterrupt:
    client.loop_stop()
    client.disconnect()

