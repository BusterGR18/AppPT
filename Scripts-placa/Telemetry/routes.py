import time
import serial
import paho.mqtt.client as mqtt
import json
import threading
from datetime import datetime, timedelta
from geopy.distance import geodesic

# MQTT Configuration
MQTT_BROKER = "c4527dc1a0d9425f8b451446a7ebca7f.s1.eu.hivemq.cloud"
MQTT_PORT = 8883
MQTT_TOPIC = "board1/tele/location"
MQTT_CLIENT_ID = "board11"
MQTT_USERNAME = "board1"
MQTT_PASSWORD = "Cacas1234"

# Serial Configuration
ser = serial.Serial('/dev/ttyUSB1')

# MQTT Client Setup
client = mqtt.Client(MQTT_CLIENT_ID)
client.username_pw_set(MQTT_USERNAME, MQTT_PASSWORD)
client.tls_set()

def on_connect(client, userdata, flags, rc):
    print(f"Connected with result code {rc}")

client.on_connect = on_connect
client.connect(MQTT_BROKER, MQTT_PORT, 60)
client.loop_start()

# GPS Tracking Variables
route_points = []
last_location = None
last_movement_time = datetime.utcnow()
movement_threshold = 5  # Meters
stop_threshold = timedelta(minutes=10)  # 10 Minutes

def parse_gpgga(gpgga_str):
    parts = gpgga_str.split(',')
    if len(parts) < 15:
        return None, None
    lat = convert_to_decimal(parts[2], parts[3])
    lon = convert_to_decimal(parts[4], parts[5])
    return lat, lon

def convert_to_decimal(degree_str, direction):
    degrees = float(degree_str[:2])
    minutes = float(degree_str[2:])
    decimal = degrees + (minutes / 60)
    if direction in ['S', 'W']:
        decimal = -decimal
    return decimal

def add_point(lat, lon):
    global last_location, last_movement_time
    new_point = (lat, lon)
    
    if last_location:
        distance = geodesic(last_location, new_point).meters
        if distance > movement_threshold:
            route_points.append({"lat": lat, "lon": lon, "timestamp": datetime.utcnow().isoformat() + 'Z'})
            last_location = new_point
            last_movement_time = datetime.utcnow()
    else:
        route_points.append({"lat": lat, "lon": lon, "timestamp": datetime.utcnow().isoformat() + 'Z'})
        last_location = new_point
        last_movement_time = datetime.utcnow()

def create_geojson():
    geojson = {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": [[point["lon"], point["lat"]] for point in route_points]
            },
            "properties": {
                "timestamps": [point["timestamp"] for point in route_points]
            }
        }]
    }
    return json.dumps(geojson)

def gps_reader():
    global route_points
    while True:
        try:
            ubi = ser.readline().strip().decode('utf-8')
            if 'GPGGA' in ubi:
                lat, lon = parse_gpgga(ubi)
                if lat and lon:
                    add_point(lat, lon)
        except Exception as e:
            print(f"Error reading GPS: {e}")
        time.sleep(30)

def mqtt_sender():
    global route_points
    while True:
        try:
            if datetime.utcnow() - last_movement_time > stop_threshold:
                mqtt_message = create_geojson()
                client.publish(MQTT_TOPIC, mqtt_message)
                route_points = []  # Reset the route points after sending
        except Exception as e:
            print(f"Error sending MQTT: {e}")
        time.sleep(10)  # Check every 10 seconds if the user has stopped moving

def main():
    gps_thread = threading.Thread(target=gps_reader)
    mqtt_thread = threading.Thread(target=mqtt_sender)

    gps_thread.start()
    mqtt_thread.start()

    gps_thread.join()
    mqtt_thread.join()

try:
    main()
except KeyboardInterrupt:
    ser.close()
    client.loop_stop()
    client.disconnect()
