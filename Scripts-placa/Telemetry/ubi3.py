import time
import serial
import paho.mqtt.client as mqtt
import json
from datetime import datetime

# MQTT Configuration
MQTT_BROKER = "c4527dc1a0d9425f8b451446a7ebca7f.s1.eu.hivemq.cloud"
MQTT_PORT = 8883  # Default port for MQTT over SSL
MQTT_TOPIC = "board1/tele/location"  # Replace with your topic
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


def parse_gpgga(gpgga_str):
    parts = gpgga_str.split(',')
    if len(parts) < 15:
        return None, None  
    lat = parts[2] + ',' + parts[3]
    lon = parts[4] + ',' + parts[5]
    return lat, lon

def create_mqtt_message(lat, lon):
    message = {
        "location": [{
            "_id": "unique_id",  # Replace with a unique identifier
            "useremail": "user@example.com",  # Replace with the user's email
            "boardid": "board123",  # Replace with the board ID
            "events": [{   
                "value": f"Latitude: {lat}, Longitude: {lon}",
                "when": datetime.utcnow().isoformat() + 'Z'
            }]
        }]
    }
    return json.dumps(message)

# Lectura a traves de serial de la ubicación
def LecGpsStr():
    while True:
        ubi = ser.readline().strip().decode('utf-8')
        if 'GPGGA' in ubi: 
            print(ubi)
            lat, lon = parse_gpgga(ubi)
            if lat and lon:
                mqtt_message = create_mqtt_message(lat, lon)
                client.publish(MQTT_TOPIC, mqtt_message)
            time.sleep(30) 

try:
    LecGpsStr()
except KeyboardInterrupt:  
    ser.close()
    client.loop_stop()
    client.disconnect()
