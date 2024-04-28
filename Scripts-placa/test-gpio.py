import time                                           
from periphery import GPIO                            
                                                      
# Acceder a GPIO /dev/gpiochip0 pin 3 en modo de entrada
gpio_in = GPIO("/dev/gpiochip0", 3, "in")       
# Acceder a GPIO /dev/gpiochip0 pin 0 en modo de entrada
gpio_in_0 = GPIO("/dev/gpiochip0", 0, "in")     
def print_message():                            
    print ('==================================')
    print ('|         Prueba basica          |')   
    print ('|        ----------------        |')
    print ('|         Doble SW520D           |')
    print ('|                                |')  
    print ('|        Utilizando GPIO         |')  
    print ('|        ----------------        |')  
    print ('|                                |')  
    print ('|                                |')  
    print ('==================================\n')
    print ('Script corriendo...')           
    print ('Matar manualmente por favor...')           
                             
print_message()              
while True:                               
    value = gpio_in.read()                
    value2 = gpio_in_0.read()             
    if(value):                            
            time.sleep(2)               
            print ('********************')
            print ('*    Inclinado!    *')
            print ('********************')
            print ('\n')                  
            print (value2)
    else:                                 
        print ('========================')
        print ('=     No inclinado...  =')
        print ('========================')
        print ('\n')                      
        print (value2)                    
        time.sleep(2)     