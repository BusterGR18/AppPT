import React, { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa'; 
import { jwtDecode } from 'jwt-decode';
import { Container, Nav, Navbar, Table, Button, Dropdown, Modal, Form,NavDropdown } from 'react-bootstrap';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const ReporteAccidentes = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [accidents, setAccidents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAccident, setSelectedAccident] = useState(null);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  // Fetch accident data from the backend
  const fetchAccidents = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/accidents?email=${currentUserEmail}`);
      

      const filteredAccidents = response.data.filter((accident) => !accident.isGuestMode);

      setAccidents(filteredAccidents);
    } catch (error) {
      console.error('Error fetching accidents:', error);
    }
  };

  useEffect(() => {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    document.body.classList.toggle('dark-mode', prefersDarkScheme.matches);
    setIsDarkMode(prefersDarkScheme.matches);

    const handleDarkModeChange = (e) => setIsDarkMode(e.matches);
    prefersDarkScheme.addEventListener('change', handleDarkModeChange);
    return () => prefersDarkScheme.removeEventListener('change', handleDarkModeChange);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
    } else {
      const decodedToken = jwtDecode(token);
      setCurrentUserEmail(decodedToken.email);
    }
  }, []);

  useEffect(() => {
    if (currentUserEmail) {
      fetchAccidents();
    }
  }, [currentUserEmail]);

  const handleShowModal = (accident) => {
    setSelectedAccident(accident);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedAccident(null);
    setShowModal(false);
  };

  const parseLocationValue = (locationValue) => {
    console.log('Parsing location value:', locationValue);
  
    const regex = /Latitude:\s*([\d.]+)\s*,?\s*([NS]),?\s*Longitude:\s*([\d.]+)\s*,?\s*([EW])/i;
    const match = regex.exec(locationValue);

    if (!match) {
      console.error('Regex failed to match location format:', locationValue);
      throw new Error('Invalid location format');
    }
  
    const [, latitude, latDirection, longitude, longDirection] = match;
  
    console.log('Extracted coordinates:', {
      latitude,
      latDirection,
      longitude,
      longDirection,
    });
  
    // Convert to signed decimal
    const parsedLatitude = parseFloat(latitude) * (latDirection === 'S' ? -1 : 1);
    const parsedLongitude = parseFloat(longitude) * (longDirection === 'W' ? -1 : 1);
  
    console.log('Parsed coordinates:', {
      latitude: parsedLatitude,
      longitude: parsedLongitude,
    });
  
    if (isNaN(parsedLatitude) || isNaN(parsedLongitude)) {
      console.error('Parsed coordinates are invalid:', {
        latitude: parsedLatitude,
        longitude: parsedLongitude,
      });
      throw new Error('Invalid coordinates');
    }
  
    return { latitude: parsedLatitude, longitude: parsedLongitude };
  };
  
  
  const handleShowMap = (locationValue) => {
    try {
      const { latitude, longitude } = parseLocationValue(locationValue);
      setSelectedLocation({ latitude, longitude });
      setShowMapModal(true);
    } catch (error) {
      console.error('Error parsing location:', error);
      alert('Invalid location data. Unable to display map.');
    }
  };
  
  const handleGoogleMapsLink = (locationValue) => {
    try {
      const { latitude, longitude } = parseLocationValue(locationValue);
      window.open(
        `https://www.google.com/maps?q=${latitude},${longitude}`,
        '_blank'
      );
    } catch (error) {
      console.error('Error parsing location:', error);
      alert('Invalid location data. Unable to open Google Maps.');
    }
  };
  

  const customMarkerIcon = L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: #007bff; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">📍</div>`,
    iconSize: [24, 24],
  });

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
        <h1>Reporte de Accidentes</h1>
        <Table striped bordered hover variant={isDarkMode ? 'dark' : 'light'}>
  <thead>
    <tr>
      <th>Tipo de Accidente</th>
      <th>Fecha y Hora</th>
      <th>Ubicación</th>
      <th>Board ID</th>
      <th>Usuario</th>
      <th>Detalles</th>
    </tr>
  </thead>
  <tbody>
    {accidents.map((accident) => (
      <tr key={accident._id}>
        <td>{accident.accidentType}</td>
        <td>{new Date(accident.timeOfAccident).toLocaleString()}</td>
        <td>
          <Button variant="link" onClick={() => handleShowMap(accident.location.value)}>
            Ver en Mapa
          </Button>{' '}
          |{' '}
          <Button variant="link" onClick={() => handleGoogleMapsLink(accident.location.value)}>
            Google Maps
          </Button>
        </td>
        <td>{accident.boardId}</td>
        <td>{currentUserEmail || "N/A"}</td>
        <td>
          <Button variant="info" onClick={() => handleShowModal(accident)}>Ver</Button>
        </td>
      </tr>
    ))}
  </tbody>
</Table>


        <Modal show={showMapModal} onHide={() => setShowMapModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Ubicación del Accidente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedLocation && (
            <MapContainer
              center={[selectedLocation.latitude, selectedLocation.longitude]}
              zoom={13}
              style={{ height: '400px', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
              />
              <Marker
                position={[selectedLocation.latitude, selectedLocation.longitude]}
                icon={customMarkerIcon}
              >
                <Popup>Ubicación del Accidente</Popup>
              </Marker>
            </MapContainer>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowMapModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

        {/* Accident Details Modal */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Detalles del Accidente</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedAccident && (
              <>
                <p><strong>Tipo de Accidente:</strong> {selectedAccident.accidentType}</p>
                <p><strong>Fecha y Hora:</strong> {new Date(selectedAccident.timeOfAccident).toLocaleString()}</p>
                <p><strong>Board ID:</strong> {selectedAccident.boardId}</p>
                {/*<p><strong>Ubicación:</strong> {selectedAccident.location.value}</p>                */}
                <p><strong>Usuario:</strong> {currentUserEmail|| "N/A"}</p>
                {/*<p><strong>Modo Invitado:</strong> {selectedAccident.isGuestMode ? "Sí" : "No"}</p>*/}
                <p><strong>Contactos Notificados:</strong></p>
                <ul>
                  {selectedAccident.notifiedContacts.map((contact, index) => (
                    <li key={index}>
                      {contact.alias} - {contact.number}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>Cerrar</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default ReporteAccidentes;
