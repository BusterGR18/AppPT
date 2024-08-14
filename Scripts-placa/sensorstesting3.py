import smbus
from time import sleep
from periphery import GPIO
import threading
import sys
import termios
import tty

# Some MPU6050 Registers and their Address
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

# Initialize GPIO
gpio_in = GPIO("/dev/gpiochip0", 3, "in")
gpio_in_0 = GPIO("/dev/gpiochip0", 0, "in")

def MPU_Init(bus, Device_Address):
    # Write to sample rate register
    bus.write_byte_data(Device_Address, SMPLRT_DIV, 7)

    # Write to power management register
    bus.write_byte_data(Device_Address, PWR_MGMT_1, 1)

    # Write to Configuration register
    bus.write_byte_data(Device_Address, CONFIG, 0)

    # Write to Gyro configuration register
    bus.write_byte_data(Device_Address, GYRO_CONFIG, 24)

    # Write to interrupt enable register
    bus.write_byte_data(Device_Address, INT_ENABLE, 1)

def read_raw_data(bus, addr, Device_Address):
    # Accelero and Gyro value are 16-bit
    high = bus.read_byte_data(Device_Address, addr)
    low = bus.read_byte_data(Device_Address, addr + 1)

    # Concatenate higher and lower value
    value = ((high << 8) | low)

    # To get signed value from MPU6050
    if value > 32768:
        value = value - 65536
    return value

def read_register(bus, Device_Address, register):
    return bus.read_byte_data(Device_Address, register)

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
Device_Address = 0x68   # MPU6050 device address

MPU_Init(bus0, Device_Address)
MPU_Init(bus1, Device_Address)

# Check accelerometer and gyroscope configuration
accel_config_0 = read_register(bus0, Device_Address, ACCEL_CONFIG)
accel_config_1 = read_register(bus1, Device_Address, ACCEL_CONFIG)
gyro_config_0 = read_register(bus0, Device_Address, GYRO_CONFIG)
gyro_config_1 = read_register(bus1, Device_Address, GYRO_CONFIG)

print(f"Accelerometer Config (Bus 0): {accel_config_0}")
print(f"Accelerometer Config (Bus 1): {accel_config_1}")
print(f"Gyroscope Config (Bus 0): {gyro_config_0}")
print(f"Gyroscope Config (Bus 1): {gyro_config_1}")

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

def read_mpu(bus, Device_Address):
    while not stop_event.is_set():
        # Read Accelerometer raw value
        acc_x = read_raw_data(bus, ACCEL_XOUT_H, Device_Address)
        acc_y = read_raw_data(bus, ACCEL_YOUT_H, Device_Address)
        acc_z = read_raw_data(bus, ACCEL_ZOUT_H, Device_Address)

        # Read Gyroscope raw value
        gyro_x = read_raw_data(bus, GYRO_XOUT_H, Device_Address)
        gyro_y = read_raw_data(bus, GYRO_YOUT_H, Device_Address)
        gyro_z = read_raw_data(bus, GYRO_ZOUT_H, Device_Address)

        # Calculate average
        Ax = acc_x / 16384.0
        Ay = acc_y / 16384.0
        Az = acc_z / 16384.0

        Gx = gyro_x / 131.0
        Gy = gyro_y / 131.0
        Gz = gyro_z / 131.0

        with threading.Lock():
            print(f"\n \rGx={Gx:.2f} °/s  Gy={Gy:.2f} °/s  Gz={Gz:.2f} °/s  Ax={Ax:.2f} g  Ay={Ay:.2f} g  Az={Az:.2f} g", end="")

        sleep(1)

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

# Create threads for MPU and GPIO reading
mpu_thread0 = threading.Thread(target=read_mpu, args=(bus0, Device_Address))
mpu_thread1 = threading.Thread(target=read_mpu, args=(bus1, Device_Address))
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

