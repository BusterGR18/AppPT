import React, { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa'; 
import { jwtDecode } from 'jwt-decode';
import { Container, Nav, Navbar, Table, Button, Dropdown, Modal, Form,NavDropdown } from 'react-bootstrap';
import axios from 'axios';

const ReporteAccidentes = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [accidents, setAccidents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAccident, setSelectedAccident] = useState(null);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  // Fetch accident data from the backend
  const fetchAccidents = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/accidents?useremail=${currentUserEmail}`);
      setAccidents(response.data);
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
              <th>Modo Invitado</th>
              <th>Detalles</th>
            </tr>
          </thead>
          <tbody>
            {accidents.map((accident) => (
              <tr key={accident._id}>
                <td>{accident.accidentType}</td>
                <td>{new Date(accident.timeOfAccident).toLocaleString()}</td>
                <td>{accident.location.value}</td>
                <td>{accident.boardid}</td>
                <td>{accident.user?.name || "N/A"}</td>
                <td>{accident.isGuestMode ? "Sí" : "No"}</td>
                <td>
                  <Button variant="info" onClick={() => handleShowModal(accident)}>Ver</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

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
                <p><strong>Ubicación:</strong> {selectedAccident.location.value}</p>
                <p><strong>Board ID:</strong> {selectedAccident.boardid}</p>
                <p><strong>Usuario:</strong> {selectedAccident.user?.name || "N/A"}</p>
                <p><strong>Modo Invitado:</strong> {selectedAccident.isGuestMode ? "Sí" : "No"}</p>
                <p><strong>Contactos Notificados:</strong></p>
                <ul>
                  {selectedAccident.notifiedContacts.map((contact, index) => (
                    <li key={index}>
                      {contact.name} - {contact.phoneNumber}
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
