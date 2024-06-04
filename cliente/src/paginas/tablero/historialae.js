import React, { useEffect } from 'react';
import { Container, Row, Col, Nav, Table, Button, Navbar, NavDropdown } from 'react-bootstrap';

const HistorialAE = () => {
  const handleLogout = () => {
    // Matar token JWT del almacenamiento
    localStorage.removeItem('token');
    // Redireccion al login    
    window.location.href = '/login';
  };
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
      <Button variant="outline-secondary" onClick={handleLogout}>
        Cerrar Sesión
      </Button>
      </footer>
    </div>
  );
};

export default HistorialAE;
