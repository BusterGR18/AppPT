/*//DASH V4 CODE
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Nav, Tab, Card, NavDropdown, Button, Navbar, Table, Form } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios'; // To make HTTP requests
//import jwtDecode from 'jwt-decode';
import {jwtDecode} from 'jwt-decode';

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
      <Card.Title>Ultima ubicacion</Card.Title>
      <MapContainer center={center} zoom={zoom} style={{ height: '500px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={center}>
          <Popup>{popupContent}</Popup>
        </Marker>
      </MapContainer>
    </Card.Body>
  </Card>
);

const Dashboard = () => {
  const [latestLocation, setLatestLocation] = useState(null);
  const [boardIDs, setBoardIDs] = useState([]);
  const defaultPosition = [51.505, -0.09];
  const [userEmail, setUserEmail] = useState(null);
  const [selectedBoardID, setSelectedBoardID] = useState(null);
  const [batteryStatus, setBatteryStatus] = useState('N/A');
  const [contactCount, setContactCount] = useState(0);
  const [accidentHistory, setAccidentHistory] = useState('No data available'); // Placeholder

  const handleLogout = () => {
    // Remove JWT token from storage
    localStorage.removeItem('token');
    // Redirect to login
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
    if (userEmail && selectedBoardID) {
      const fetchLatestLocation = async () => {
        try {
          const response = await axios.get(`http://localhost:4000/api/telemetry/location/${userEmail}/${selectedBoardID}`);
          if (response.data && response.data.length > 0) {
            const { location } = response.data[0];
            const latestEvent = location.events[0]; // Assuming the latest event is at the start of the array
            const { value } = latestEvent;
            const position = value.split(',').map(Number); // Assuming value is "latitude,longitude"
            setLatestLocation({
              position,
              popupContent: `Última ubicación registrada en: ${latestEvent.when}`
            });
          }
        } catch (error) {
          console.error('Error fetching the latest location:', error);
          // Handle error (e.g., show a message to the user)
        }
      };

      const fetchBatteryStatus = async () => {
        try {
          const response = await axios.get(`http://localhost:4000/api/telemetry/status/${userEmail}/${selectedBoardID}`);
          if (response.data && response.data.battery) {
            setBatteryStatus(response.data.battery);
          }
        } catch (error) {
          console.error('Error fetching battery status:', error);
        }
      };

      fetchLatestLocation();
      fetchBatteryStatus();
    }
  }, [userEmail, selectedBoardID]);

  useEffect(() => {
    const fetchContactCount = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/contacts/?useremail=${userEmail}`);
        if (response.data && response.data.length >= 0) {
          setContactCount(response.data.length);
        }
      } catch (error) {
        console.error('Error fetching contact count:', error);
      }
    };

    fetchContactCount();
  }, [userEmail]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('token') !== null;
    if (!isAuthenticated) {
      window.location.href = '/login';
    }
  }, []);

  return (
    <div>
      <Container className="mt-5">
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

        <Tab.Container id="dashboard-tabs" defaultActiveKey="VistaGeneral">
          <Row>
            <Col md={12}>
              <Tab.Content>
                <Tab.Pane eventKey="VistaGeneral">
                  <h2>Bienvenido</h2>
                  <Row>
                    <Col md={3}>
                      <WelcomeCard
                        title="Modulos registrados"
                        description="Listado de los modulos vinculados al usuario"
                      >
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
                      </WelcomeCard>
                    </Col>
                    <Col md={4}>
                      <WelcomeCard
                        title="Datos Generales"
                        description="Datos del sistema: "
                      >
                        <Table striped bordered hover>
                          <tbody>
                            <tr>
                              <td>Status (Batería)</td>
                              <td>{batteryStatus}</td>
                            </tr>
                            <tr>
                              <td>Número de contactos registrados</td>
                              <td>{contactCount}</td>
                            </tr>
                            <tr>
                              <td>Historial de accidentes</td>
                              <td>{accidentHistory}</td>
                            </tr>
                          </tbody>
                        </Table>
                      </WelcomeCard>
                    </Col>
                    <Col md={5}>
                      <WelcomeCard
                        title="Seleccionar Módulo"
                        description="Seleccione un módulo para ver su última ubicación"
                      >
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
                      <MapCard
                        center={latestLocation ? latestLocation.position : defaultPosition}
                        zoom={13}
                        popupContent={latestLocation ? latestLocation.popupContent : "Última ubicación registrada."}
                      />
                    </Col>
                  </Row>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>

      <footer className="fixed-bottom text-center py-2 bg-light">
        <Button variant="outline-secondary" onClick={handleLogout}>
          Cerrar Sesión
        </Button>
      </footer>
    </div>
  );
};

export default Dashboard;
*/
/*
//V5 CODE
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Nav, Tab, Card, NavDropdown, Button, Navbar, Table, Form } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

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
        <Marker position={center}>
          <Popup>{popupContent}</Popup>
        </Marker>
      </MapContainer>
    </Card.Body>
  </Card>
);

const Dashboard = () => {
  const [latestLocation, setLatestLocation] = useState(null);
  const [boardIDs, setBoardIDs] = useState([]);
  const defaultPosition = [51.505, -0.09];
  const [userEmail, setUserEmail] = useState(null);
  const [selectedBoardID, setSelectedBoardID] = useState('');
  const [batteryStatus, setBatteryStatus] = useState('N/A');
  const [contactCount, setContactCount] = useState(0);
  const [accidentHistory, setAccidentHistory] = useState('No data available'); // Placeholder

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
    if (userEmail && selectedBoardID) {
      const fetchLatestLocation = async () => {
        try {
          const response = await axios.get(`http://localhost:4000/api/telemetry/location/${userEmail}/${selectedBoardID}`);
          if (response.data && response.data.length > 0) {
            const { events } = response.data[0]; // Assuming response structure
            const { value, when } = events; // Destructure value and when from events
            const [latitudeStr, longitudeStr] = value.match(/[-+]?\d*\.\d+|\d+/g); // Extract latitude and longitude from value
            const latitude = parseFloat(latitudeStr); // Parse latitude as float
            const longitude = parseFloat(longitudeStr); // Parse longitude as float
            
            setLatestLocation({
              position: [latitude, longitude], // Assuming position should be an array of numbers
              popupContent: `Última ubicación registrada en: ${when}`
            });
          }
        } catch (error) {
          console.error('Error fetching the latest location:', error);
        }
      };
      

      const fetchBatteryStatus = async () => {
        try {
          const response = await axios.get(`http://localhost:4000/api/telemetry/battery/${userEmail}/${selectedBoardID}`);
          if (response.data && response.data.length > 0) {
            const batteryValue = response.data[0].events.value;
            // Extract the percentage value using string manipulation
            const percentage = batteryValue.split(':')[1].trim(); // This assumes the format is consistent
            setBatteryStatus(percentage);
            console.log(percentage);
          }
        } catch (error) {
          console.error('Error fetching battery status:', error);
        }
      };
      fetchLatestLocation();
      fetchBatteryStatus();
    }
  }, [userEmail, selectedBoardID]);

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
    const isAuthenticated = localStorage.getItem('token') !== null;
    if (!isAuthenticated) {
      window.location.href = '/login';
    }
  }, []);

  return (
    <div>
      <Container className="mt-5">
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

        <Tab.Container id="dashboard-tabs" defaultActiveKey="VistaGeneral">
          <Row>
            <Col md={12}>
              <Tab.Content>
                <Tab.Pane eventKey="VistaGeneral">
                  <h2>Bienvenido</h2>
                  <Row>
                    <Col md={3}>
                      <WelcomeCard
                        title="Módulos registrados"
                        description="Listado de los módulos vinculados al usuario"
                      >
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
                      </WelcomeCard>
                    </Col>
                    <Col md={4}>
                      <WelcomeCard
                        title="Datos Generales"
                        description="Datos del sistema: "
                      >
                        <Table striped bordered hover>
                          <tbody>
                            <tr>
                              <td>Status (Batería)</td>
                              <td>{batteryStatus}</td>
                            </tr>
                            <tr>
                              <td>Número de contactos registrados</td>
                              <td>{contactCount}</td>
                            </tr>
                            <tr>
                              <td>Historial de accidentes</td>
                              <td>{accidentHistory}</td>
                            </tr>
                          </tbody>
                        </Table>
                      </WelcomeCard>
                    </Col>
                    <Col md={5}>
                      <WelcomeCard
                        title="Seleccionar Módulo"
                        description="Seleccione un módulo para ver su última ubicación"
                      >
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
                      <MapCard
                        center={latestLocation ? latestLocation.position : defaultPosition}
                        zoom={13}
                        popupContent={latestLocation ? latestLocation.popupContent : "Última ubicación registrada."}
                      />
                    </Col>
                  </Row>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>

      <footer className="fixed-bottom text-center py-2 bg-light">
        <Button variant="outline-secondary" onClick={handleLogout}>
          Cerrar Sesión
        </Button>
      </footer>
    </div>
  );
};

export default Dashboard;
*/
//V6
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Nav, Tab, Card, NavDropdown, Button, Navbar, Table, Form } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup,useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import L from 'leaflet';
import 'leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

const WelcomeCard = ({ title, description, children }) => (
  <Card>
    <Card.Body>
      <Card.Title>{title}</Card.Title>
      <Card.Text>{description}</Card.Text>
      {children}
    </Card.Body>
  </Card>
);

/*const MapCard = ({ center, zoom, popupContent }) => (
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
);*/
//MAPCARDV2
const MapCard = ({ center, zoom, popupContent }) => (
  <Card>
    <Card.Body>
      <Card.Title>Última ubicación</Card.Title>
      {/* MapContainer with Leaflet map */}
      <MapContainer center={center} zoom={zoom} style={{ height: '500px', width: '100%' }}>
        {/* TileLayer for OpenStreetMap */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* Marker with Popup */}
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
  const defaultPosition = [51.505, -0.09];
  const [userEmail, setUserEmail] = useState(null);
  const [selectedBoardID, setSelectedBoardID] = useState('');
  const [batteryStatus, setBatteryStatus] = useState('N/A');
  const [contactCount, setContactCount] = useState(0);
  const [accidentHistory, setAccidentHistory] = useState('No data available');

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
        console.log('Fetched board IDs:', response.data); // Log board IDs
      } catch (error) {
        console.error('Error fetching board IDs:', error);
      }
    };

    fetchBoardIDs();
  }, []);

  useEffect(() => {
    if (userEmail && selectedBoardID) {
      const fetchLatestLocation = async () => {
        try {
          const response = await axios.get(`http://localhost:4000/api/telemetry/location/${userEmail}/${selectedBoardID}`);
          if (response.data && response.data.length > 0) {
            console.log(response.data)
            const { events } = response.data[0]; // Assuming response structure
            const { value, when } = events; // Destructure value and when from events
      
            // Extract latitude and longitude from value
            const latitudeRegex = /Latitude:\s*(-?\d+\.\d+)/;
            const longitudeRegex = /Longitude:\s*(-?\d+\.\d+)/;
      
            const latitudeMatch = value.match(latitudeRegex);
            const longitudeMatch = value.match(longitudeRegex);
      
            if (latitudeMatch && longitudeMatch) {
              let latitude = parseFloat(latitudeMatch[1]) / 100; // Adjusting for format
              let longitude = parseFloat(longitudeMatch[1]) / 100; // Adjusting for format
              
      
              // Handle west direction (longitude)
              if (value.includes('W')) {
                longitude = -Math.abs(longitude); // Ensure longitude is negative
              }
              
              if (value.includes(',S')) {
                longitude = -Math.abs(latitude); // Ensure longitude is negative
              }
              console.log(latitude)
              console.log(longitude)
      
              setLatestLocation({
                position: [latitude, longitude],
                popupContent: `Última ubicación registrada en: ${when}`
              });
            } else {
              console.error('Error: Unable to parse latitude or longitude from telemetry data');
            }
          }
        } catch (error) {
          console.error('Error fetching the latest location:', error);
        }
      };
      
      
      
      
      
      
      
      
      

      const fetchBatteryStatus = async () => {
        try {
          const response = await axios.get(`http://localhost:4000/api/telemetry/battery/${userEmail}/${selectedBoardID}`);
          console.log('Fetched battery status response:', response.data); // Log battery status response
          if (response.data && response.data.length > 0) {
            const batteryValue = response.data[0].events.value;
            const percentage = batteryValue.split(':')[1].trim();
            setBatteryStatus(percentage);
          }
        } catch (error) {
          console.error('Error fetching battery status:', error);
        }
      };

      fetchLatestLocation();
      fetchBatteryStatus();
    }
  }, [userEmail, selectedBoardID]);

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
    const isAuthenticated = localStorage.getItem('token') !== null;
    if (!isAuthenticated) {
      window.location.href = '/login';
    }
  }, []);

  return (
    <div>
      <Container className="mt-5">
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

        <Tab.Container id="dashboard-tabs" defaultActiveKey="VistaGeneral">
          <Row>
            <Col md={12}>
              <Tab.Content>
                <Tab.Pane eventKey="VistaGeneral">
                  <h2>Bienvenido</h2>
                  <Row>
                    <Col md={3}>
                      <WelcomeCard
                        title="Módulos registrados"
                        description="Listado de los módulos vinculados al usuario"
                      >
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
                      </WelcomeCard>
                    </Col>
                    <Col md={4}>
                      <WelcomeCard
                        title="Datos Generales"
                        description="Datos del sistema: "
                      >
                        <Table striped bordered hover>
                          <tbody>
                            <tr>
                              <td>Status (Batería)</td>
                              <td>{batteryStatus}</td>
                            </tr>
                            <tr>
                              <td>Número de contactos registrados</td>
                              <td>{contactCount}</td>
                            </tr>
                            <tr>
                              <td>Historial de accidentes</td>
                              <td>{accidentHistory}</td>
                            </tr>
                          </tbody>
                        </Table>
                      </WelcomeCard>
                    </Col>
                    <Col md={5}>
                      <WelcomeCard
                        title="Seleccionar Módulo"
                        description="Seleccione un módulo para ver su última ubicación"
                      >
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
                      {latestLocation && (
                        <MapCard
                          center={latestLocation.position}
                          zoom={13}
                          popupContent={latestLocation.popupContent}
                        />
                      )}
                    </Col>
                  </Row>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>

      <footer className="fixed-bottom text-center py-2 bg-light">
        <Button variant="outline-secondary" onClick={handleLogout}>
          Cerrar Sesión
        </Button>
      </footer>
    </div>
  );
};

export default Dashboard;
