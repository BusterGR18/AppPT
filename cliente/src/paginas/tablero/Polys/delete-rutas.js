import React, { useState, useEffect } from 'react';
import { Container, Nav, Navbar, Button, NavDropdown } from 'react-bootstrap';
import { MapContainer, TileLayer, Polygon, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import * as turf from '@turf/turf';

const Delete_Rutas = () => {
  const [geojsonData, setGeojsonData] = useState(null);

  const handleCreated = (e) => {
    const layer = e.layer;
    const geojson = layer.toGeoJSON();
    setGeojsonData(geojson);
    //Salida del poligono a consola
    console.log('Generated GeoJSON:', geojson);
    //Establecimiento de un buffer de cinco metros al poligono
    const bufferedGeojson = turf.buffer(geojson, 5, { units: 'meters' });

    // Salida del poligono con buffer a la consola
    console.log('Buffered GeoJSON:', bufferedGeojson);
  };

  return (
    <div>  
      <Navbar bg="light" expand="lg" fixed="top">
        <Container>
          <Navbar.Brand href="/">SiNoMoto</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              <Nav.Link href='/dash'>Inicio</Nav.Link>
              <Nav.Link href='/contactos'>Contactos</Nav.Link>
              <NavDropdown title="Rutas" id="basic-nav-dropdown">
                <NavDropdown.Item href="#register-route">Registrar Nueva Ruta</NavDropdown.Item>
                <NavDropdown.Item href="#view-routes">Visualizar Rutas Existentes</NavDropdown.Item>
                <NavDropdown.Item href="#delete-routes">Eliminar Rutas</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link href='/estadisticas'>Estadisticas</Nav.Link>
              <Nav.Link href='/configuracion'>Configuración</Nav.Link>          
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <br>
      </br>

      <br></br>
      <div id="leafletmap">
        <MapContainer center={[0, 0]} zoom={2} style={{ height: '500px', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {geojsonData && <Polygon positions={geojsonData.geometry.coordinates} />}

          <DrawControl onCreated={handleCreated} />
        </MapContainer>
      </div>

      <footer className="fixed-bottom text-center py-2 bg-light">
        <Button variant="outline-secondary" >
          Cerrar Sesión
        </Button>
      </footer>
      
    </div>
  );
};

//Logica relacionada al mapa
//Se incluye la creacion del mapa y sus herramientas de dibujo

const DrawControl = ({ onCreated }) => {
  const map = useMap();

  useEffect(() => {
    const drawControl = new L.Control.Draw({
      position: 'topright',
      draw: {
        marker: false,
        circlemarker: false,
        circle: false,
        polyline: false,
        rectangle: false,
        polygon: {
          allowIntersection: false,
          showArea: true,
        },
      },
      edit: {
        featureGroup: new L.FeatureGroup(), // Requerido para la herramienta de dibujo
      },
    });

    map.addControl(drawControl);
    map.on('draw:created', onCreated);

    // Se pide la ubicacion del usuario
    map.locate({ setView: true, maxZoom: 16 });

    return () => {
      map.off('draw:created', onCreated);
      map.removeControl(drawControl);
    };
  }, [map, onCreated]);

  return null;
};

export default Delete_Rutas;
