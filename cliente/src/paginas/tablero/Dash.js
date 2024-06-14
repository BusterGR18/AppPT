/*import React, { useEffect } from 'react';
import { Container, Row, Col, Nav, Tab, Card,NavDropdown, Button, Navbar } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const WelcomeCard = ({ title, description }) => (
  <Card>
    <Card.Body>
      <Card.Title>{title}</Card.Title>
      <Card.Text>{description}</Card.Text>
      <Button variant="primary">Ver Detalles</Button>
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
  const handleLogout = () => {
    // Matar token JWT del almacenamiento
    localStorage.removeItem('token');
    // Redireccion al login    
    window.location.href = '/login';
  };
  const defaultPosition = [51.505, -0.09];
  useEffect(() => {    
    // Check if user is authenticated (e.g., by verifying JWT token)
    const isAuthenticated = localStorage.getItem('token') !== null;
    
    // If user is not authenticated, redirect to login page
    if (!isAuthenticated) {
        // Redirect to login page
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
                    />
                  </Col>
                  <Col md={4}>
                    <WelcomeCard
                      title="Datos Generales"
                      description="Datos del sistema: Status, Numero de contactos registrados, Historial de accidentes"
                    />
                  </Col>
                  <Col md={5}>
                    <MapCard
                      center={defaultPosition}
                      zoom={13}
                      popupContent="Última ubicación registrada."
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


//V2
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Nav, Tab, Card, NavDropdown, Button, Navbar } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios'; // To make HTTP requests
import {jwtDecode} from 'jwt-decode';

const WelcomeCard = ({ title, description }) => (
  <Card>
    <Card.Body>
      <Card.Title>{title}</Card.Title>
      <Card.Text>{description}</Card.Text>
      <Button variant="primary">Ver Detalles</Button>
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
  const defaultPosition = [51.505, -0.09];
  const [userEmail, setUserEmail] = useState(null);
  const [boardID, setboardID] = useState(null);

  const handleLogout = () => {
    // Remove JWT token from storage
    localStorage.removeItem('token');
    // Redirect to login
    window.location.href = '/login';
  };

  useEffect(() => {    
    const fetchLatestLocation = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }
      else{
        const decodedToken = jwtDecode(token);
        //console.log('Decoded Token:', decodedToken);
        setUserEmail(decodedToken.email);
        //console.log(decodedToken.email)
      }

      try {        
        const response = await axios.get(`http://localhost:4000/api/geojson/?useremail=${userEmail}/?boardid=${boardID}`);

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

    fetchLatestLocation();
  }, []);

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
                      />
                    </Col>
                    <Col md={4}>
                      <WelcomeCard
                        title="Datos Generales"
                        description="Datos del sistema: Status, Numero de contactos registrados, Historial de accidentes"
                      />
                    </Col>
                    <Col md={5}>
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

//V3
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Nav, Tab, Card, NavDropdown, Button, Navbar, Table, Form } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios'; // To make HTTP requests
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

      fetchLatestLocation();
    }
  }, [userEmail, selectedBoardID]);

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
                        description="Datos del sistema: Status, Numero de contactos registrados, Historial de accidentes"
                      />
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
//V4
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
