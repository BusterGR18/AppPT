import React, { useState, useEffect } from 'react';
import { Container, Nav, Navbar, Button, NavDropdown, Form, Dropdown, Alert } from 'react-bootstrap';
import { MapContainer, TileLayer, Polygon, useMap } from 'react-leaflet';
import { FaUserCircle } from 'react-icons/fa'; 
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import L from 'leaflet';
import 'leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Delete_Rutas = () => {
  const [geojsonData, setGeojsonData] = useState(null);
  const [savedPolygons, setSavedPolygons] = useState([]);
  const [selectedPolygon, setSelectedPolygon] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [drawnPolygons, setDrawnPolygons] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [settings, setSettings] = useState({ enableGuestMode: false });

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const isAuthenticated = token !== null;

    if (!isAuthenticated) {
      window.location.href = '/login';
    } else {
      const decodedToken = jwtDecode(token);
      setUserEmail(decodedToken.email);
      fetchSavedPolygons(decodedToken.email);
      fetchSettings(decodedToken.email);
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

  const fetchSettings = async (userEmail) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/settings/?useremail=${userEmail}`);
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching user settings:', error);
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
      setSelectedPolygon(null);
    } catch (error) {
      console.error('Error deleting polygon:', error);
    }
  };

  useEffect(() => {
    const polygonsToDraw = selectedPolygon ? [selectedPolygon] : [];
    setDrawnPolygons(polygonsToDraw);
  }, [selectedPolygon]);

  useEffect(() => {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    if (prefersDarkScheme.matches) {
      document.body.classList.add('dark-mode');
      setIsDarkMode(true);
    } else {
      document.body.classList.remove('dark-mode');
      setIsDarkMode(false);
    }

    const handleDarkModeChange = (e) => {
      if (e.matches) {
        document.body.classList.add('dark-mode');
        setIsDarkMode(true);
      } else {
        document.body.classList.remove('dark-mode');
        setIsDarkMode(false);
      }
    };

    prefersDarkScheme.addEventListener('change', handleDarkModeChange);

    return () => {
      prefersDarkScheme.removeEventListener('change', handleDarkModeChange);
    };
  }, []);

  return (
    <div>
      <Navbar className={isDarkMode ? 'navbar-dark-mode' : 'navbar-light'} expand="lg" fixed="top">
        <Container className="navbar-container">
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
              <Dropdown className="profile-dropdown" align="items-end">
                <Dropdown.Toggle variant="link" id="profile-dropdown">
                  <FaUserCircle size={24} color="#fff" />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={handleLogout}>Cerrar Sesión</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>  
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className={`mt-5 ${isDarkMode ? 'container-dark' : 'container'}`}>
        {settings.enableGuestMode ? (
          <Alert variant="warning" className="text-center">
            ⚠ Esta funcionalidad está restringida cuando habilitas el modo de invitado ⚠
          </Alert>
        ) : (
          <>
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

            <Form.Select onChange={handlePolygonSelect} className="mt-3">
              <option value="">Seleccionar Polígono</option>
              {savedPolygons.map((polygon, index) => (
                <option key={index} value={JSON.stringify(polygon)}>
                  Polígono {index + 1}
                </option>
              ))}
            </Form.Select>
            <Button variant="danger" onClick={handleDeletePolygon} disabled={!selectedPolygon} className="mt-3">
              Eliminar Polígono
            </Button>
          </>
        )}
      </Container>
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
