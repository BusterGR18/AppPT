import smbus
from time import sleep, time
from datetime import datetime
from periphery import GPIO
import threading
import sys
import termios
import tty
import serial

# MPU6050 Registers and their Address
PWR_MGMT_1   = 0x6B
SMPLRT_DIV   = 0x19
CONFIG       = 0x1A
GYRO_CONFIG  = 0x1B
ACCEL_CONFIG = 0x1C
INT_ENABLE   = 0x38
ACCEL_XOUT_H = 0x3B
ACCEL_YOUT_H = 0x3D
ACCEL_ZOUT_H = 0x3F
GYRO_XOUT_H  = 0x43
GYRO_YOUT_H  = 0x45
GYRO_ZOUT_H  = 0x47

# GPIO Initialization
gpio_in = GPIO("/dev/gpiochip0", 3, "in")
gpio_in_0 = GPIO("/dev/gpiochip0", 0, "in")

# Serial Configuration for GPS
ser = serial.Serial('/dev/ttyUSB1')

def MPU_Init(bus, Device_Address):
    bus.write_byte_data(Device_Address, SMPLRT_DIV, 7)
    bus.write_byte_data(Device_Address, PWR_MGMT_1, 1)
    bus.write_byte_data(Device_Address, CONFIG, 0)
    bus.write_byte_data(Device_Address, GYRO_CONFIG, 24)
    bus.write_byte_data(Device_Address, INT_ENABLE, 1)

def read_raw_data(bus, addr, Device_Address):
    high = bus.read_byte_data(Device_Address, addr)
    low = bus.read_byte_data(Device_Address, addr + 1)
    value = (high << 8) | low
    if value > 32768:
        value -= 65536
    return value

def parse_gpgga(gpgga_str):
    parts = gpgga_str.split(',')
    if len(parts) < 15:
        return None, None  
    lat = parts[2] + ',' + parts[3]
    lon = parts[4] + ',' + parts[5]
    return lat, lon

def get_gps_location():
    while True:
        line = ser.readline().strip().decode('utf-8')
        if 'GPGGA' in line: 
            lat, lon = parse_gpgga(line)
            if lat and lon:
                return lat, lon

def write_accident_to_file(lat, lon):
    with open("accident_report.txt", "w") as file:
        file.write(f"Accident detected at {datetime.now()}:\n")
        file.write(f"Location: Latitude {lat}, Longitude {lon}\n")

def detect_crash(bus, Device_Address):
    prev_speed = 0
    while not stop_event.is_set():
        acc_x = read_raw_data(bus, ACCEL_XOUT_H, Device_Address)
        acc_y = read_raw_data(bus, ACCEL_YOUT_H, Device_Address)
        acc_z = read_raw_data(bus, ACCEL_ZOUT_H, Device_Address)
        gyro_x = read_raw_data(bus, GYRO_XOUT_H, Device_Address)
        gyro_y = read_raw_data(bus, GYRO_YOUT_H, Device_Address)
        gyro_z = read_raw_data(bus, GYRO_ZOUT_H, Device_Address)

        Ax = acc_x / 16384.0
        Ay = acc_y / 16384.0
        Az = acc_z / 16384.0

        Gx = gyro_x / 131.0
        Gy = gyro_y / 131.0
        Gz = gyro_z / 131.0

        current_speed = (Ax**2 + Ay**2 + Az**2)**0.5
        delta_speed = current_speed - prev_speed
        prev_speed = current_speed

        tilt_angle = max(abs(Gx), abs(Gy), abs(Gz))
        deceleration = abs(delta_speed) / 0.008  # 8ms window

        if tilt_angle > 55 and deceleration > 0.46 and delta_speed > 1.7649:
            lat, lon = get_gps_location()
            write_accident_to_file(lat, lon)
            print(f"\nAccident detected! Location: Latitude {lat}, Longitude {lon}\n")

        sleep(0.008)

def print_message():
    print('==================================')
    print('|         Prueba basica          |')
    print('|        ----------------        |')
    print('|         Doble SW520D           |')
    print('|                                |')
    print('|        Utilizando GPIO         |')
    print('|        ----------------        |')
    print('|                                |')
    print('|                                |')
    print('==================================\n')
    print('Script corriendo...')
    print('Presione q para salir...')

bus0 = smbus.SMBus(0)
bus1 = smbus.SMBus(1)
Device_Address = 0x68

MPU_Init(bus0, Device_Address)
MPU_Init(bus1, Device_Address)

print_message()

def getch():
    fd = sys.stdin.fileno()
    old_settings = termios.tcgetattr(fd)
    try:
        tty.setraw(sys.stdin.fileno())
        ch = sys.stdin.read(1)
    finally:
        termios.tcsetattr(fd, termios.TCSADRAIN, old_settings)
    return ch

stop_event = threading.Event()

def read_gpio():
    while not stop_event.is_set():
        value = gpio_in.read()
        value2 = gpio_in_0.read()

        left_tilt_status = "Left tilt sensor: Tilted" if value else "Left tilt sensor: Not tilted"
        right_tilt_status = "Right tilt sensor: Tilted" if value2 else "Right tilt sensor: Not tilted"

        with threading.Lock():
            print(f"\n \r{left_tilt_status: <30}{right_tilt_status}", end="")

        sleep(2)

def main_loop():
    while not stop_event.is_set():
        if getch().strip().lower() == 'q':
            print("\nExiting...")
            stop_event.set()

# Create threads for crash detection, GPIO reading, and MPU reading
mpu_thread0 = threading.Thread(target=detect_crash, args=(bus0, Device_Address))
mpu_thread1 = threading.Thread(target=detect_crash, args=(bus1, Device_Address))
gpio_thread = threading.Thread(target=read_gpio)

# Start threads
mpu_thread0.start()
mpu_thread1.start()
gpio_thread.start()

# Main loop to catch 'q' press
try:
    main_loop()
except KeyboardInterrupt:
    print("\nKeyboardInterrupt received, exiting...")
    stop_event.set()

# Ensure all threads are stopped
mpu_thread0.join()
mpu_thread1.join()
gpio_thread.join()
    