import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Navbar, Nav, Card } from 'react-bootstrap';

const Inicio = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    const updateTheme = (e) => {
      const dark = e.matches ?? prefersDarkScheme.matches;
      document.body.classList.toggle('dark-mode', dark);
      setIsDarkMode(dark);
    };

    updateTheme(prefersDarkScheme);
    prefersDarkScheme.addEventListener('change', updateTheme);

    return () => prefersDarkScheme.removeEventListener('change', updateTheme);
  }, []);

  return (
    <>
      {/* Navbar */}
    <Navbar
  expand="lg"
  fixed="top"
  className={`w-100 ${isDarkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-light'}`}
  style={{ padding: 0 }}
>

  <Container fluid className="px-3 d-flex justify-content-between align-items-center">
    <Navbar.Brand href="/" className="fw-bold fs-4 m-0">SiNoMoto</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse
  id="basic-navbar-nav"
  className={isDarkMode ? 'bg-dark text-light' : 'bg-light text-dark'}
>
      <Nav className="ms-auto">
        <Nav.Link href="/modfis">Módulo</Nav.Link>
        <Nav.Link href="/acercade">Nosotros</Nav.Link>
        <Nav.Link href="/signup">Registrarse</Nav.Link>
        <Nav.Link href="/login">Iniciar Sesión</Nav.Link>
      </Nav>
    </Navbar.Collapse>
  </Container>
</Navbar>









      <div style={{ paddingTop: '64px' }}>
  <Container
    fluid
    className={`text-center p-4 rounded shadow-sm ${
      isDarkMode ? 'bg-dark text-light' : 'bg-light text-dark'
    }`}
  >
    <h1 className="display-5 fw-bold">Bienvenido a SiNoMoto</h1>
    <p className="lead">Un sistema inteligente de notificación ante accidentes para motocicletas.</p>
    <Button variant="primary" size="lg" href="/signup">
      Comenzar
    </Button>
  </Container>
</div>



      {/* Feature Sections */}
      <Container className="mt-5">
        <Row className="g-5">
          <Col md={4}>
            <Card className="h-100 shadow-sm">
              <Card.Img variant="top" src="https://via.placeholder.com/600x400" />
              <Card.Body>
                <Card.Title>Módulo Físico</Card.Title>
                <Card.Text>
                  Descubre cómo nuestro módulo se integra con tu motocicleta para brindarte seguridad en todo momento.
                </Card.Text>
                <Button variant="outline-primary" href="/modfis">Ver más</Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="h-100 shadow-sm">
              <Card.Img variant="top" src="https://via.placeholder.com/600x400" />
              <Card.Body className="d-flex flex-column justify-content-center align-items-center text-center">
                <Card.Title>¿Quiénes somos?</Card.Title>
                <Card.Text>
                  Conoce al equipo detrás de este prototipo.
                </Card.Text>
                <Button variant="outline-light" href="/acercade">Acerca de nosotros</Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="h-100 shadow-sm">
              <Card.Img variant="top" src="https://via.placeholder.com/600x400" />
              <Card.Body className="d-flex flex-column justify-content-center align-items-center text-center">
                <Card.Title>¿Tienes un módulo?</Card.Title>
                <Card.Text>
                  Si ya cuentas con el dispositivo, regístrate para activar todas las funcionalidades.
                </Card.Text>
                <Button variant="success" href="/signup">Registrarse</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Footer */}
      <footer className={isDarkMode ? 'footer-dark-mode' : 'footer-light'}>
        <Container className="text-center py-4">
          <p className="footer-text mb-0">© 2025 SiNoMoto. PT2.</p>
        </Container>
      </footer>
    </>
  );
};

export default Inicio;
