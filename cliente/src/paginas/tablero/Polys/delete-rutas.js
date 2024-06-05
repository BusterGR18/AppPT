/*
//V1
import React, { useState, useEffect } from 'react';
import { Container, Nav, Navbar, Button, NavDropdown, Form } from 'react-bootstrap';
import { MapContainer, TileLayer, Polygon, useMap } from 'react-leaflet';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import L from 'leaflet';
import 'leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

const Delete_Rutas = () => {
  const [geojsonData, setGeojsonData] = useState(null);
  const [savedPolygons, setSavedPolygons] = useState([]);
  const [selectedPolygon, setSelectedPolygon] = useState(null);
  //const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const isAuthenticated = token !== null;

    if (!isAuthenticated) {
      window.location.href = '/login';
    } else {
      const decodedToken = jwtDecode(token);
      console.log('Decoded Token:', decodedToken);
      //setUserEmail(decodedToken.email);
      console.log(decodedToken.email);
      fetchSavedPolygons(decodedToken.email);
    }
  }, []);

  const fetchSavedPolygons = async (userEmail) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/geojson/?useremail=${userEmail}`);
      console.log('Fetched polygons:', response.data); // Debug log for fetched polygons
      setSavedPolygons(response.data);
    } catch (error) {
      console.error('Error fetching saved polygons:', error);
    }
  };

  const handlePolygonSelect = (e) => {
    const polygonValue = e.target.value;
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
                <NavDropdown.Item href="/registerruta">Registrar Nueva Ruta</NavDropdown.Item>
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

          {selectedPolygon && (
            <Polygon
              positions={selectedPolygon.coordinates[0].map(coord => [coord[1], coord[0]])}
            />
          )}

          {geojsonData && (
            <Polygon
              positions={geojsonData.geometry.coordinates[0].map(coord => [coord[1], coord[0]])}
            />
          )}
        </MapContainer>
      </Container>

      <Container fluid>
        <Form.Select onChange={handlePolygonSelect}>
          <option value="">Seleccionar Polígono</option>
          {savedPolygons.map((polygon, index) => (
            <option key={index} value={JSON.stringify(polygon.geometry)}>
              Polígono {index + 1}
            </option>
          ))}
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

    map.addControl(drawControl);
    map.on('draw:created', onCreated);
    map.locate({ setView: true, maxZoom: 14 });

    return () => {
      map.off('draw:created', onCreated);
      map.removeControl(drawControl);
    };
  }, [map, onCreated]);

  return null;
};
export default Delete_Rutas;
*/

//V2


//V3
import React, { useState, useEffect } from 'react';
import { Container, Nav, Navbar, Button, NavDropdown, Form } from 'react-bootstrap';
import { MapContainer, TileLayer, Polygon, useMap } from 'react-leaflet';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import L from 'leaflet';
import 'leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

const Delete_Rutas = () => {
  const [geojsonData, setGeojsonData] = useState(null);
  const [savedPolygons, setSavedPolygons] = useState([]);
  const [selectedPolygon, setSelectedPolygon] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [drawnPolygons, setDrawnPolygons] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const isAuthenticated = token !== null;

    if (!isAuthenticated) {
      window.location.href = '/login';
    } else {
      const decodedToken = jwtDecode(token);
      setUserEmail(decodedToken.email);
      fetchSavedPolygons(decodedToken.email);
    }
  }, []);

  const fetchSavedPolygons = async (userEmail) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/geojson/?useremail=${userEmail}`);
      setSavedPolygons(response.data);      
    } catch (error) {
      console.error('Error fetching saved polygons:', error);
    }
  };

  const handlePolygonSelect = (e) => {
    const polygonValue = e.target.value;
    console.log('Selected polygon value:', polygonValue);
    if (polygonValue) {
      setSelectedPolygon(JSON.parse(polygonValue));
    } else {
      setSelectedPolygon(null);
    }
  };

  const handleDeletePolygon = async () => {
    try {
      if (!selectedPolygon || !selectedPolygon._id) {
        console.error('No polygon selected or missing ID');
        return;
      }

      await axios.delete(`http://localhost:4000/api/geojson/${selectedPolygon._id}`);
      console.log('Polygon deleted successfully');
      fetchSavedPolygons(userEmail);
      setSelectedPolygon(null); // Clear the selected polygon
    } catch (error) {
      console.error('Error deleting polygon:', error);
    }
  };

  useEffect(() => {
    // Populate the drawnPolygons array with the selected polygon
    const polygonsToDraw = selectedPolygon ? [selectedPolygon] : [];
    setDrawnPolygons(polygonsToDraw);
  }, [selectedPolygon]); // Run this effect whenever selectedPolygon changes

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
                <NavDropdown.Item href="/registerruta">Registrar Nueva Ruta</NavDropdown.Item>
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
        <MapContainer center={[0, 0]} zoom={2} style={{ height: '500px', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {drawnPolygons.map((polygon, index) => (
            <Polygon
              key={index}
              positions={polygon.geojsonData.geometry.coordinates[0].map(coord => [coord[1], coord[0]])}
            />
          ))}
          <DrawControl/>
        </MapContainer>
      </Container>

      <Container fluid>
        <Form.Select onChange={handlePolygonSelect}>
          <option value="">Seleccionar Polígono</option>
          {savedPolygons.map((polygon, index) => (
            <option key={index} value={JSON.stringify(polygon)}>
              Polígono {index + 1}
            </option>
          ))}
        </Form.Select>
        <Button variant="danger" onClick={handleDeletePolygon} disabled={!selectedPolygon}>
          Eliminar Polígono
        </Button>
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

export default Delete_Rutas;
