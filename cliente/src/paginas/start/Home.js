import React, { useEffect,useState } from 'react';
import { Container, Row, Col, Button, Navbar, Nav } from 'react-bootstrap';

const Inicio = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

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
    <>
      <Navbar className={isDarkMode ? 'navbar-dark-mode' : 'navbar-light'} expand="lg" fixed="top">
        <Container>
          <Navbar.Brand href="/">SiNoMoto</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              <Nav.Link href="/modfis">Modulo</Nav.Link>
              <Nav.Link href="/acercade">Acerca de Nosotros</Nav.Link>
              <Nav.Link href="/signup">Registrarse</Nav.Link>
              <Nav.Link href="/login">Iniciar Sesion</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={8} className="text-center">
            <h1>Gracias por visitar SiNoMoto</h1>
            <p className="lead">
              SiNoMoto es un prototipo de un sistema de notificación en caso de accidentes para motocicletas
            </p>
          </Col>
        </Row>

        <Row className="mt-5">
          <Col md={6}>
            <img
              src="https://via.placeholder.com/600x400"
              alt="Product Showcase"
              className="img-fluid rounded"
            />
          </Col>
          <Col md={6}>
            <h2>Modulo Fisico</h2>
            <p>
              Conoce más acerca de nuestro modulo fisico y como interactua con tu motocicleta
            </p>
            <Button variant="primary" href="/modfis">
              Learn More
            </Button>
          </Col>
        </Row>

        <Row className="mt-5">
          <Col className="text-center">
            <h2>Quienes somos?</h2>
            <p>
              Conoce nuestros objetivos con este prototipo
            </p>
            <Button variant="outline-primary" href="/acercade">
              Acerca de nosotros
            </Button>
          </Col>
        </Row>

        <Row className="mt-5">
          <Col className="text-center">
            <h2>Cuentas con un modulo fisico?</h2>
            <p>
              Continua con el proceso registrandote a continuación
            </p>
            <Button variant="success" href="/signup">
              Registrarse
            </Button>
          </Col>
        </Row>
      </Container>

      <footer className={isDarkMode ? 'footer-dark-mode' : 'footer-light'}>
      <Container>
        <p className="footer-text">© 2024 SiNoMoto. PT2</p>
      </Container>
    </footer>
    </>
  );
};

export default Inicio;

