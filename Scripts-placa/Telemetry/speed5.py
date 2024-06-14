import time
import serial
import paho.mqtt.client as mqtt
import json
from datetime import datetime

# MQTT Configuration
MQTT_BROKER = "c4527dc1a0d9425f8b451446a7ebca7f.s1.eu.hivemq.cloud"
MQTT_PORT = 8883  # Default port for MQTT over SSL
MQTT_TOPIC = "board1/tele/speed"  # MQTT topic for speed data
MQTT_CLIENT_ID = "board11"  # Replace with your client ID
MQTT_USERNAME = "board1"  # Replace with your username
MQTT_PASSWORD = "Cacas1234"  # Replace with your password

# Serial Configuration
ser = serial.Serial('/dev/ttyUSB1')

# MQTT Client Setup
client = mqtt.Client(MQTT_CLIENT_ID)
client.username_pw_set(MQTT_USERNAME, MQTT_PASSWORD)
client.tls_set()  # Enable TLS/SSL

def on_connect(client, userdata, flags, rc):
    print(f"Connected with result code {rc}")

client.on_connect = on_connect
client.connect(MQTT_BROKER, MQTT_PORT, 60)
client.loop_start()

# Function to parse and publish speed
def publish_speed(speed):
    try:
        # Extract speed in kilometers per hour (0.0,K)
        speed_parts = speed.split(',')
        if len(speed_parts) >= 9 and speed_parts[8] == 'K':
            kmh_speed = float(speed_parts[7])  # Speed in kilometers per hour
            publish_data = {
                "speed": [{
                    "_id": "unique_id",  # Replace with a unique identifier
                    "useremail": "user@example.com",  # Replace with the user's email
                    "boardid": "board123",  # Replace with the board ID
                    "events": [{
                        "value": f"Speed: {kmh_speed} km/h",
                        "when": datetime.utcnow().isoformat() + 'Z'
                    }]
                }]
            }
            client.publish(MQTT_TOPIC, json.dumps(publish_data))
            print(f"Published speed: {kmh_speed} km/h")
    except Exception as e:
        print(f"Error parsing or publishing speed: {e}")

# Main function to read GPS speed
def LecGpsStr():
    while True:
        speed = ser.readline().strip().decode('utf-8')
        if 'GPVTG' in speed:
            print(speed)
            publish_speed(speed)
        time.sleep(10)

try:
    LecGpsStr()
except KeyboardInterrupt:
    ser.close()
    client.loop_stop()
    client.disconnect()

