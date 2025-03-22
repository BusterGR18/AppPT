import React, { useState, useEffect } from 'react';
import { Container, Nav, Navbar, Button, NavDropdown, Form, Dropdown, Alert } from 'react-bootstrap';
import { MapContainer, TileLayer, Polygon, useMap } from 'react-leaflet';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import L from 'leaflet';
import 'leaflet-draw';
import 'leaflet/dist/leaflet.css';
import { FaUserCircle } from 'react-icons/fa'; 
import 'leaflet-draw/dist/leaflet.draw.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const ViewRutas = () => {
  const [geojsonData, setGeojsonData] = useState(null);
  const [savedPolygons, setSavedPolygons] = useState([]);
  const [selectedPolygon, setSelectedPolygon] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [settings, setSettings] = useState({ enableGuestMode: false });
  const [userEmail, setUserEmail] = useState(null);

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
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/geojson/?useremail=${userEmail}`);
      setSavedPolygons(response.data);
    } catch (error) {
      console.error('Error fetching saved polygons:', error);
    }
  };

  const fetchSettings = async (userEmail) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/settings/?useremail=${userEmail}`);
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching user settings:', error);
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
            <FontAwesomeIcon icon={L.Icon.Default.prototype.options.exclamationTriangle} size="2x" className="mb-2" />
            <h4>Modo de invitado activado</h4>
            <p>⚠ Esta funcionalidad está restringida cuando habilitas el modo de invitado ⚠</p>
          </Alert>
        ) : (
          <>
            <MapContainer center={[0, 0]} zoom={2} style={{ height: '500px', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />

              {selectedPolygon && (
                <Polygon
                  positions={selectedPolygon.geometry.coordinates[0].map(coord => [coord[1], coord[0]])}
                />
              )}

              {geojsonData && (
                <Polygon
                  positions={geojsonData.geometry.coordinates[0].map(coord => [coord[1], coord[0]])}
                />
              )}
              <DrawControl />
            </MapContainer>

            <Form.Select onChange={handlePolygonSelect} className="mt-3">
              <option value="">Seleccionar Polígono</option>
              {savedPolygons.map((polygon, index) => (
                <option key={index} value={JSON.stringify(polygon.geojsonData)}>
                  Polígono {index + 1}
                </option>
              ))}
            </Form.Select>
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

export default ViewRutas;
