import React, { useState, useEffect } from 'react';
import { Container, Nav, Navbar, Button, NavDropdown, Form } from 'react-bootstrap';
import { MapContainer, TileLayer, Polygon, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import * as turf from '@turf/turf';

const ViewRutas = () => {
  const [geojsonData, setGeojsonData] = useState(null);
  const [selectedPolygon, setSelectedPolygon] = useState({ type: "Polygon", coordinates: [] });

  const handleCreated = (e) => {
    const layer = e.layer;
    const geojson = layer.toGeoJSON();
    setGeojsonData(geojson);
    console.log('Generated GeoJSON:', geojson);
    const bufferedGeojson = turf.buffer(geojson, 5, { units: 'meters' });
    console.log('Buffered GeoJSON:', bufferedGeojson);
  };

  const handlePolygonSelect = (polygonValue) => {
    if (polygonValue) {
      setSelectedPolygon(JSON.parse(polygonValue));
    } else {
      setSelectedPolygon(null);
    }
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
                <NavDropdown.Item href="/register-route">Registrar Nueva Ruta</NavDropdown.Item>
                <NavDropdown.Item href="/viewrutas">Visualizar Rutas Existentes</NavDropdown.Item>
                <NavDropdown.Item href="/deleterutas">Eliminar Rutas</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link href='/estadisticas'>Estadisticas</Nav.Link>
              <Nav.Link href='/configuracion'>Configuración</Nav.Link>          
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      
      <Container fluid>
      <br></br>
      <br></br>
      </Container>
      
      <Container fluid>
        <MapContainer center={[0, 0]} zoom={2} style={{ height: '500px', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Renderizar polígonos previamente creados */}
          {selectedPolygon && <Polygon positions={selectedPolygon.coordinates} />}
          {/* Renderizar polígono en tiempo real */}
          {geojsonData && <Polygon positions={geojsonData.geometry.coordinates} />}

          <DrawControl onCreated={handleCreated} />
        </MapContainer>
      </Container>

      <Container fluid>
        <Form.Select onChange={(e) => handlePolygonSelect(e.target.value)}>
          <option value="">Seleccionar Polígono</option>
          {/* Aquí deberías mapear sobre una lista de polígonos previamente creados */}
          {/* Por ahora, solo estoy proporcionando un ejemplo con un polígono */}
          <option value={JSON.stringify({ "type": "Polygon", "coordinates": [[[0,0],[0,10],[10,10],[10,0],[0,0]]] })}>Polígono 1</option>
        </Form.Select>
      </Container>

      <footer className="fixed-bottom text-center py-2 bg-light">
        <Button variant="outline-secondary">Cerrar Sesión</Button>
      </footer>
    </div>
  );
};

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
        featureGroup: new L.FeatureGroup(),
      },
    });

    // map.addControl(drawControl);
    map.on('draw:created', onCreated);
    map.locate({ setView: true, maxZoom: 14 });

    return () => {
      map.off('draw:created', onCreated);
      map.removeControl(drawControl);
    };
  }, [map, onCreated]);

  return null;
};

export default ViewRutas;