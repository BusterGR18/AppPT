import React, { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa'; 
import { jwtDecode } from 'jwt-decode';
import { Container, Nav, Navbar, Table, Button, Dropdown, Modal, NavDropdown } from 'react-bootstrap';
import axios from 'axios';
import { MapContainer, TileLayer, Marker  } from 'react-leaflet';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
const HistorialAInvitado = () => {
  const [accidents, setAccidents] = useState([]);
  const [userEmail, setUserEmail] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [showContactsModal, setShowContactsModal] = useState(false); // For Contacts Modal
const [showMapModal, setShowMapModal] = useState(false);           // For Map Modal
const [selectedContacts, setSelectedContacts] = useState([]);      // Selected contacts to display
const [mapLocation, setMapLocation] = useState([0, 0]);            // For Map Location
const [guestAccidents, setGuestAccidents] = useState([]);          // Data for the table
const DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

L.Marker.prototype.options.icon = DefaultIcon;

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    const decodedToken = jwtDecode(token);
    setUserEmail(decodedToken.email);
  }, []);

  const handleShowContacts = (contacts) => {
    setSelectedContacts(contacts);
    setShowContactsModal(true);
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
    if (userEmail) {
      const fetchGuestAccidents = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/accidents/guest-accident-history?email=${userEmail}`
          );
          setAccidents(response.data);
          setGuestAccidents(response.data); 
        } catch (error) {
          console.error('Error fetching guest accident history:', error);
        }
      };

      fetchGuestAccidents();
    }
  }, [userEmail]);

  const handleShowMap = (locationValue) => {
    const coords = parseLocationValue(locationValue); // Ensure you reuse the location parser.
    if (coords) {
      setMapLocation(coords);
      setShowMapModal(true);
    } else {
      alert("Invalid location data");
    }
  };
  
  const parseLocationValue = (locationValue) => {
    try {
      console.log('Parsing location value:', locationValue);
      const regex = /Latitude:\s*([\d.]+),([NS]),\s*Longitude:\s*([\d.]+),([EW])/;
      const match = locationValue.match(regex);
  
      if (!match) {
        console.error('Regex failed to match location format:', locationValue);
        throw new Error('Invalid location format');
      }
  
      let [_, lat, latDir, lon, lonDir] = match;
      lat = parseFloat(lat);
      lon = parseFloat(lon);
  
      if (latDir === 'S') lat = -lat;
      if (lonDir === 'W') lon = -lon;
  
      console.log('Parsed coordinates:', { lat, lon });
      return { lat, lon };
    } catch (error) {
      console.error('Error parsing location:', error);
      throw new Error('Invalid coordinates');
    }
  };
  

  

  

  return (
    <div style={{ paddingTop: '64px' }}>
    <Navbar
      expand="lg"
      fixed="top"
      className={`w-100 mb-3 ${isDarkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-light'}`}
      style={{ padding: 0 }}
    >
      <Container fluid className="px-3 d-flex justify-content-between align-items-center">
        <Navbar.Brand href="/" className="fw-bold fs-4 m-0">SiNoMoto</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse
          id="basic-navbar-nav"
          className={isDarkMode ? 'bg-dark text-light' : 'bg-light text-dark'}
        >
          <Nav className="ms-auto align-items-center text-center text-lg-start">
            <Nav.Link href="/dash">Inicio</Nav.Link>
            <Nav.Link href="/contactos">Contactos</Nav.Link>
    
            <NavDropdown title="Rutas" id="basic-nav-dropdown">
              <NavDropdown.Item href="/registerruta">Registrar Nueva Ruta</NavDropdown.Item>
              <NavDropdown.Item href="/viewrutas">Visualizar Rutas Existentes</NavDropdown.Item>
              <NavDropdown.Item href="/deleterutas">Eliminar Rutas</NavDropdown.Item>
            </NavDropdown>
    
            <Nav.Link href="/estadisticas">Estadísticas</Nav.Link>
            <Nav.Link href="/configuracion">Configuración</Nav.Link>
    
            <Dropdown align="end">
              <Dropdown.Toggle variant="link" id="profile-dropdown" className="d-flex align-items-center px-2">
                <FaUserCircle size={24} color={isDarkMode ? "#fff" : "#000"} />
              </Dropdown.Toggle>
    
              <Dropdown.Menu
                align="end"
                className={isDarkMode ? 'bg-dark text-light' : 'bg-light text-dark'}
              >
                <Dropdown.Item onClick={handleLogout}>Cerrar Sesión</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
      <Container className={`mt-5 ${isDarkMode ? 'container-dark' : 'container'}`}>
      <h1>Historial de Accidentes de Invitados</h1>
      <Table striped bordered hover variant={isDarkMode ? 'dark' : 'light'}>
  <thead>
    <tr>
      <th>Tipo de Accidente</th>
      <th>Fecha y Hora</th>
      <th>Mapa</th>
      <th>Contactos Notificados</th>
    </tr>
  </thead>
  <tbody>
    {guestAccidents.map((accident) => (
      <tr key={accident._id}>
        <td>{accident.accidentType}</td>
        <td>{new Date(accident.timeOfAccident).toLocaleString()}</td>
        <td>
          <Button variant="link" onClick={() => handleShowMap(accident.location.value)}>
            Ver en Mapa
          </Button>
        </td>
        <td>
          <Button variant="info" onClick={() => handleShowContacts(accident.notifiedContacts)}>
            Ver Contactos
          </Button>
        </td>
      </tr>
    ))}
  </tbody>
</Table>


<Modal show={showContactsModal} onHide={() => setShowContactsModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Contactos Notificados</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {selectedContacts && selectedContacts.length > 0 ? (
      <ul>
        {selectedContacts.map((contact) => (
          <li key={contact._id}>
            {contact.alias}: {contact.number}
          </li>
        ))}
      </ul>
    ) : (
      <p>No hay contactos notificados.</p>
    )}
  </Modal.Body>
</Modal>

<Modal show={showMapModal} onHide={() => setShowMapModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Ubicación del Accidente</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <MapContainer center={mapLocation} zoom={13} style={{ height: "400px" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={mapLocation}></Marker>
    </MapContainer>
  </Modal.Body>
</Modal>


      </Container>
    </div>
  );
};

export default HistorialAInvitado;
