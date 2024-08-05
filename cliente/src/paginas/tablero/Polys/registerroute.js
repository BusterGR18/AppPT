import React, { useState, useEffect } from 'react';
import { Container, Nav, Navbar, Button, NavDropdown, Dropdown } from 'react-bootstrap';
import { MapContainer, TileLayer, Polygon, useMap } from 'react-leaflet';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import L from 'leaflet';
import 'leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { FaUserCircle } from 'react-icons/fa'; 
import * as turf from '@turf/turf';

const RegisterRuta = () => {
  const [userEmail, setUserEmail] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const handleLogout = () => {
    // Matar token JWT del almacenamiento
    localStorage.removeItem('token');
    // Redireccion al login    
    window.location.href = '/login';
  };
  useEffect(() => {    
    // Check if user is authenticated (e.g., by verifying JWT token)
    const token = localStorage.getItem('token');
    const isAuthenticated = localStorage.getItem('token') !== null;
    
    // If user is not authenticated, redirect to login page
    if (!isAuthenticated) {
        // Redirect to login page
        window.location.href = '/login';
    }
    else{
      const decodedToken = jwtDecode(token);
      //console.log('Decoded Token:', decodedToken);
      setUserEmail(decodedToken.email);
      //console.log(decodedToken.email)
    }
  }, []);
  const [geojsonData, setGeojsonData] = useState(null);

  const handleCreated = async (e) => {
    const layer = e.layer;
    const geojson = layer.toGeoJSON();
    setGeojsonData(geojson);
  
    // Output the polygon to console
    console.log('Generated GeoJSON:', geojson);
  
    // Establish a buffer of five meters to the polygon
    const bufferedGeojson = turf.buffer(geojson, 5, { units: 'meters' });
  
    // Output the buffered polygon to console
    console.log('Buffered GeoJSON:', bufferedGeojson);
  
    try {
      // Send GeoJSON data along with user email to backend API
      await axios.post('http://localhost:4000/api/geojson', { geojsonData: bufferedGeojson, useremail: userEmail });
      console.log('GeoJSON data saved successfully');
    } catch (error) {
      console.error('Error saving GeoJSON data:', error);
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

export default RegisterRuta;