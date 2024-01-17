import React from 'react';
import { Container, Row, Col, Nav, Tab, Card, Button, Navbar } from 'react-bootstrap';
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
  const defaultPosition = [51.505, -0.09];

  return (
    <Container className="mt-5">
      <Navbar bg="light" expand="lg" fixed="top">
        <Container>
          <Navbar.Brand href="/">SiNoMoto</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              <Nav.Link href='/dash'>Inicio</Nav.Link>
              <Nav.Link href='/contactos'>Contactos</Nav.Link>
              <Nav.Link href='/rutas'>Rutas</Nav.Link>
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
                      description="Visualiza las ventas mensuales y realiza un seguimiento de los ingresos."
                    />
                  </Col>
                  <Col md={4}>
                    <WelcomeCard
                      title="Datos Generales"
                      description="Descubre quiénes son los principales vendedores este mes."
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
  );
};

export default Dashboard;
