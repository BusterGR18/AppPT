##prototipo inicial con un solo poligono
import time 
from turfpy.measurement import boolean_point_in_polygon
from geojson import Point, Feature, Polygon
ultima_ubicacion = Feature(geometry=Point([-34.0,58.0]))
geocerco = Feature(geometry=Polygon([([(-81, 41), (-81, 47), (-72, 47), (-72, 41), (-81, 41)])]))
comprobacion = boolean_point_in_polygon(ultima_ubicacion, geocerco)

##combrobación binaria
if comprobacion:
    print('Dentro')
    time.sleep (1)
elif comprobacion is False:
    print('Fuera')
    time.sleep (2)



