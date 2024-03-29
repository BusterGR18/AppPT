import time
import serial
ser = serial.Serial('/dev/ttyUSB1')


# Lectura a traves de serial de la ubicación 
def LecGpsStr():
    #ser.flush()
    while True:
        ubi = ser.readline().strip().decode('utf-8')
        if 'GPGGA' in ubi:
            print(ubi)
            #return line


while True:    
    LecGpsStr()    
    time.sleep(30)

ser.close()