import React, { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa'; 
import { jwtDecode } from 'jwt-decode';
import { Container, Nav, Navbar, Table, Button, Dropdown, Modal, Form,NavDropdown } from 'react-bootstrap';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
const HistorialAInvitado = () => {
  const [accidents, setAccidents] = useState([]);
  const [userEmail, setUserEmail] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedAccident, setSelectedAccident] = useState(null);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

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
            `http://localhost:4000/api/accidents/guest-accident-history?email=${userEmail}`
          );
          setAccidents(response.data);
        } catch (error) {
          console.error('Error fetching guest accident history:', error);
        }
      };

      fetchGuestAccidents();
    }
  }, [userEmail]);

  const handleShowMap = (location) => {
    // Implement Leaflet Map Modal logic here
  };

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
      <h1>Historial de Accidentes de Invitados</h1>
      <Table striped bordered hover variant={isDarkMode ? 'dark' : 'light'}>
        <thead>
          <tr>
            <th>Perfil Invitado</th>
            <th>Board ID</th>
            <th>Tipo de Accidente</th>
            <th>Fecha y Hora</th>
            <th>Ubicación</th>
            <th>Contactos Notificados</th>
          </tr>
        </thead>
        <tbody>
          {accidents.map((accident) => (
            <tr key={accident._id}>
              <td>{accident.guestProfileId.name}</td>
              <td>{accident.guestProfileId.boardID}</td>
              <td>{accident.accidentType}</td>
              <td>{new Date(accident.timeOfAccident).toLocaleString()}</td>
              <td>
                <Button variant="link" onClick={() => handleShowMap(accident.location.value)}>
                  Ver en Mapa
                </Button>
              </td>
              <td>
                {accident.notifiedContacts.map((contact) => (
                  <p key={contact._id}>{`${contact.alias} (${contact.number})`}</p>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      </Container>
    </div>
  );
};

export default HistorialAInvitado;
