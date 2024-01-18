import React from 'react';
import { Container, Row, Col, Nav, Table, Button, Navbar } from 'react-bootstrap';

const HistorialAE = () => {
  return (
    <div>
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

      <Container className="mt-5">
        <h1 className="text-center mb-4">Historial de accidentes</h1>

        <Row className="justify-content-center">
          <Col md={8}>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Tipo de accidente</th>
                  <th>Ubicación</th>
                  <th>Hora</th>
                  <th>A quien se notificó</th>
                </tr>
              </thead>
              <tbody>
                {/* Example rows */}
                <tr>
                  <td>Choque</td>
                  <td>123 Main St</td>
                  <td>12:30 PM</td>
                  <td>Nombre de la persona</td>
                </tr>
                <tr>
                  <td>Caída</td>
                  <td>456 Oak St</td>
                  <td>3:45 PM</td>
                  <td>Otro contacto</td>
                </tr>
                {/* Add more example rows as needed */}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>

      <footer className="fixed-bottom text-center py-2 bg-light">
        <Button variant="outline-secondary">Cerrar Sesión</Button>
      </footer>
    </div>
  );
};

export default HistorialAE;
