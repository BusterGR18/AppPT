/*import React, { useState, useEffect } from 'react';
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

          {/* Renderizar polígonos previamente creados *//*}
          {selectedPolygon && <Polygon positions={selectedPolygon.coordinates} />}
          {/* Renderizar polígono en tiempo real *//*}
          {geojsonData && <Polygon positions={geojsonData.geometry.coordinates} />}

          <DrawControl onCreated={handleCreated} />
        </MapContainer>
      </Container>

      <Container fluid>
        <Form.Select onChange={(e) => handlePolygonSelect(e.target.value)}>
          <option value="">Seleccionar Polígono</option>
          {/* Aquí deberías mapear sobre una lista de polígonos previamente creados *//*}
          {/* Por ahora, solo estoy proporcionando un ejemplo con un polígono *//*}
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
*/
//V2
/*
import React, { useState, useEffect } from 'react';
import { Container, Nav, Navbar, Button, NavDropdown, Form } from 'react-bootstrap';
import { MapContainer, TileLayer, Polygon, useMap } from 'react-leaflet';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import L from 'leaflet';
import 'leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import * as turf from '@turf/turf';

const ViewRutas = () => {
  const [geojsonData, setGeojsonData] = useState(null);
  const [savedPolygons, setSavedPolygons] = useState([]);
  const [selectedPolygon, setSelectedPolygon] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const isAuthenticated = localStorage.getItem('token') !== null;

    if (!isAuthenticated) {
      window.location.href = '/login';
    } else {
      const decodedToken = jwtDecode(token);
      console.log('Decoded Token:', decodedToken);
      setUserEmail(decodedToken.email);
      console.log(decodedToken.email)
      fetchSavedPolygons(decodedToken.email);
    }
  }, []);

  const fetchSavedPolygons = async (userEmail) => {
    //const userEmail = localStorage.getItem('userEmail'); // Assume userEmail is stored in localStorage
    try {
      //const response = await axios.get('http://localhost:4000/api/geojson', {          params: { useremail: userEmail }        });
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

          {savedPolygons.map((polygon, index) => (
            <Polygon key={index} positions={polygon.geometry.coordinates} />
          ))}

          {geojsonData && <Polygon positions={geojsonData.geometry.coordinates} />}          
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

export default ViewRutas;
*/
//V3
/*
import React, { useState, useEffect } from 'react';
import { Container, Nav, Navbar, Button, NavDropdown, Form } from 'react-bootstrap';
import { MapContainer, TileLayer, Polygon, useMap } from 'react-leaflet';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import L from 'leaflet';
import 'leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

const ViewRutas = () => {
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
            <option key={index} value={JSON.stringify(polygon.geojsonData)}>
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

export default ViewRutas;
*/
//V4
import React, { useState, useEffect } from 'react';
import { Container, Nav, Navbar, Button, NavDropdown, Form, Dropdown } from 'react-bootstrap';
import { MapContainer, TileLayer, Polygon, useMap } from 'react-leaflet';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import L from 'leaflet';
import 'leaflet-draw';
import 'leaflet/dist/leaflet.css';
import { FaUserCircle } from 'react-icons/fa'; 
import 'leaflet-draw/dist/leaflet.draw.css';

const ViewRutas = () => {
  const [geojsonData, setGeojsonData] = useState(null);
  const [savedPolygons, setSavedPolygons] = useState([]);
  const [selectedPolygon, setSelectedPolygon] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const handleLogout = () => {
    // Matar token JWT del almacenamiento
    localStorage.removeItem('token');
    // Redireccion al login    
    window.location.href = '/login';
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const isAuthenticated = token !== null;

    if (!isAuthenticated) {
      window.location.href = '/login';
    } else {
      const decodedToken = jwtDecode(token);
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


      <Container fluid>
        <p></p>
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
          <DrawControl/>
        </MapContainer>
      </Container>

      <Container fluid>
        <Form.Select onChange={handlePolygonSelect}>
          <option value="">Seleccionar Polígono</option>
          {savedPolygons.map((polygon, index) => (
            <option key={index} value={JSON.stringify(polygon.geojsonData)}>
              Polígono {index + 1}
            </option>
          ))}
        </Form.Select>
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
        featureGroup: new L.FeatureGroup(), // Requerido para la herramienta de dibujo
      },
    });

    //map.addControl(drawControl);
    map.on('draw:created', onCreated);

    // Se pide la ubicacion del usuario
    map.locate({ setView: true, maxZoom: 14 });

    return () => {
      map.off('draw:created', onCreated);
      map.removeControl(drawControl);
    };
  }, [map, onCreated]);

  return null;
};

export default ViewRutas;
