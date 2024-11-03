import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Nav, Tab, Card, NavDropdown, Button, Navbar, Table, Form,Dropdown } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup,useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import 'leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { FaUserCircle } from 'react-icons/fa'; 
import { Link } from 'react-router-dom';
const WelcomeCard = ({ title, description, children }) => (
  <Card>
    <Card.Body>
      <Card.Title>{title}</Card.Title>
      <Card.Text>{description}</Card.Text>
      {children}
    </Card.Body>
  </Card>
);

const MapCard = ({ center, zoom, popupContent }) => (
  <Card>
    <Card.Body>
      <Card.Title>Última ubicación</Card.Title>
      <MapContainer center={center} zoom={zoom} style={{ height: '500px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {center && (
          <Marker position={center}>
            <Popup>{popupContent}</Popup>
          </Marker>
        )}
      </MapContainer>
    </Card.Body>
  </Card>
);

const Dashboard = () => {
  const [latestLocation, setLatestLocation] = useState(null);
  const [boardIDs, setBoardIDs] = useState([]);
  const [guestProfile, setGuestProfile] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [selectedBoardID, setSelectedBoardID] = useState('');
  const [batteryStatus, setBatteryStatus] = useState('N/A');
  const [contactCount, setContactCount] = useState(0);
  const [accidentHistory, setAccidentHistory] = useState('No data available');
  const [settings, setSettings] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

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

    const fetchBoardIDs = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/telemetry/boardIDs/${decodedToken.email}`);
        setBoardIDs(response.data);
      } catch (error) {
        console.error('Error fetching board IDs:', error);
      }
    };

    fetchBoardIDs();
  }, []);

  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/settings/?useremail=${userEmail}`);
        setSettings(response.data);
        if (response.data.enableGuestMode && response.data.selectedGuestProfile) {
          fetchGuestProfile(response.data.selectedGuestProfile);
        }
      } catch (error) {
        console.error('Error fetching user settings:', error);
      }
    };

    if (userEmail) {
      fetchUserSettings();
    }
  }, [userEmail]);

  const fetchGuestProfile = async (profileId) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/guest-profiles/${profileId}`);
      setGuestProfile(response.data);
      if (response.data.boardID) {
        fetchTelemetryData(response.data.boardID);
      }
    } catch (error) {
      console.error('Error fetching guest profile:', error);
    }
  };

  const fetchTelemetryData = (boardID) => {
    fetchLatestLocation(boardID);
    fetchBatteryStatus(boardID);
  };

  const fetchLatestLocation = async (boardID) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/telemetry/location/${userEmail}/${boardID}`);
      if (response.data && response.data.length > 0) {
        const { events } = response.data[0];
        const { value, when } = events;

        const latitudeMatch = value.match(/Latitude:\s*(-?\d+\.\d+)/);
        const longitudeMatch = value.match(/Longitude:\s*(-?\d+\.\d+)/);

        if (latitudeMatch && longitudeMatch) {
          let latitude = parseFloat(latitudeMatch[1]) / 100;
          let longitude = parseFloat(longitudeMatch[1]) / 100;

          if (value.includes('W')) longitude = -Math.abs(longitude);
          if (value.includes('S')) latitude = -Math.abs(latitude);

          setLatestLocation({
            position: [latitude, longitude],
            popupContent: `Última ubicación registrada en: ${when}`
          });
        }
      }
    } catch (error) {
      console.error('Error fetching latest location:', error);
    }
  };

  const fetchBatteryStatus = async (boardID) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/telemetry/battery/${userEmail}/${boardID}`);
      if (response.data && response.data.length > 0) {
        const batteryValue = response.data[0].events.value;
        const percentage = batteryValue.split(':')[1].trim();
        setBatteryStatus(percentage);
      }
    } catch (error) {
      console.error('Error fetching battery status:', error);
    }
  };

  useEffect(() => {
    if (userEmail && selectedBoardID && !settings?.enableGuestMode) {
      fetchTelemetryData(selectedBoardID);
    }
  }, [userEmail, selectedBoardID, settings]);

  useEffect(() => {
    const fetchContactCount = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/contacts/?useremail=${userEmail}`);
        if (response.data) {
          setContactCount(response.data.length);
        }
      } catch (error) {
        console.error('Error fetching contact count:', error);
      }
    };

    fetchContactCount();
  }, [userEmail]);

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

      <Container className="mt-5">
        <Tab.Container id="dashboard-tabs" defaultActiveKey="VistaGeneral">
          <Row>
            <Col md={12}>
              <Tab.Content>
                <Tab.Pane eventKey="VistaGeneral">
                  <h2>Bienvenido</h2>
                  <Row>
                    <Col md={3}>
                    <WelcomeCard
                        title="Informacion basica"
                        description={
                          settings?.enableGuestMode
                            ? "Perfil de invitado vinculado"
                            : "Listado de los módulos vinculados al usuario"
                        }
                      >
                        {settings?.enableGuestMode && guestProfile ? (
                          <Table striped bordered hover>
                            <tbody>
                              <tr><td>Nombre</td><td>{guestProfile.name}</td></tr>
                              <tr><td>Email</td><td>{guestProfile.email}</td></tr>
                              <tr><td>Número</td><td>{guestProfile.phoneNumber}</td></tr>
                            </tbody>
                          </Table>
                        ) : (
                          <Table striped bordered hover>
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Board ID</th>
                              </tr>
                            </thead>
                            <tbody>
                              {boardIDs.map((boardID, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>{boardID}</td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        )}
                      </WelcomeCard>
                    </Col>
                    <Col md={4}>
                      <WelcomeCard title="Datos Generales" description="Datos del sistema">
                        <Table striped bordered hover>
                          <tbody>
                            <tr>
                              <td>Status (Batería)</td>
                              <td>{settings?.enableGuestMode ? batteryStatus : batteryStatus}</td>
                            </tr>
                            <tr>
                              <td>Número de contactos registrados</td>
                              <td>{settings?.enableGuestMode ? guestProfile?.contacts?.length || 0 : contactCount}</td>
                            </tr>
                            <tr>
                              <td>Historial de accidentes</td>
                              <td>
                                {settings?.enableGuestMode ? (
                                  <Link to="/guest-accident-history">Ver historial de este invitado</Link>
                                ) : (
                                  accidentHistory
                                )}
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                      </WelcomeCard>
                    </Col>
                    <Col md={5}>
                      {!settings?.enableGuestMode && (
                        <WelcomeCard title="Seleccionar Módulo" description="Seleccione un módulo para ver su última ubicación">
                          <Form.Control
                            as="select"
                            value={selectedBoardID}
                            onChange={(e) => setSelectedBoardID(e.target.value)}
                          >
                            <option value="">Seleccione un módulo</option>
                            {boardIDs.map((boardID) => (
                              <option key={boardID} value={boardID}>
                                {boardID}
                              </option>
                            ))}
                          </Form.Control>
                        </WelcomeCard>
                      )}
                      {latestLocation && (
                        <MapCard center={latestLocation.position} zoom={13} popupContent={latestLocation.popupContent} />
                      )}
                    </Col>
                  </Row>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    </div>
  );
};

export default Dashboard;
