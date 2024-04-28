import React, { useEffect } from 'react';
import { Container, Nav, Button, Navbar } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSadTear } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
const Estadisticas = () => {
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
              <Nav.Link href='/rutas'>Rutas</Nav.Link>
              <Nav.Link href='/estadisticas'>Estadisticas</Nav.Link>
              <Nav.Link href='/configuracion'>Configuración</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-5 text-center">
        <h1>Advertencia: No tienes tus estadísticas habilitadas</h1>
        <FontAwesomeIcon icon={faSadTear} size="4x" className="text-warning mt-3" />
        <p className="mt-3">Si deseas habilitarlas, haz clic <Link to="/configuracion">aquí</Link>.</p>
      </Container>

      <footer className="fixed-bottom text-center py-2 bg-light">
      <Button variant="outline-secondary" onClick={handleLogout}>
        Cerrar Sesión
      </Button>
      </footer>
    </div>
  );

};
export default Estadisticas;