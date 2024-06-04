import React, { useEffect } from 'react';
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
