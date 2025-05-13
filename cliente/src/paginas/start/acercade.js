import React, { useEffect,useState } from 'react';
import { Container, Row, Col, Button, Navbar, Nav } from 'react-bootstrap';

const AcercaDe = () => {
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
    
    <><>
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
    </><Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8} className="text-center">
          <h1>Acerca de Nosotros</h1>
          <p className="lead">
            Bienvenido a SiNoMoto, donde hemos invertido nuestro esfuerzo en el desarrollo de este Proyecto Terminal.
          </p>
          <p>
            En SiNoMoto, nos dedicamos a proporcionar soluciones innovadoras para mejorar la seguridad de los motociclistas. Nuestra misión es reducir los accidentes de motocicletas y sus consecuencias mediante el uso de tecnología avanzada.
          </p>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col md={6}>
          <img
            src="https://via.placeholder.com/600x400"
            alt="Team Showcase"
            className="img-fluid rounded" />
        </Col>
        <Col md={6}>
          <h2>Nuestro Equipo</h2>
          <p>
            En SiNoMoto, contamos con un equipo apasionado de profesionales dedicados a crear soluciones que salvan vidas. Desde ingenieros hasta expertos en seguridad vial, nuestro equipo está comprometido con la seguridad de los motociclistas en todo momento.
          </p>
          <Button variant="primary" href="/contact-us">
            Contáctenos
          </Button>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col md={12} className="text-center">
          <h2>Nuestra Visión</h2>
          <p>
            Buscamos un futuro donde cada motociclista pueda disfrutar de la carretera con total seguridad. Nos esforzamos por desarrollar tecnologías que reduzcan los accidentes y salven vidas.
          </p>
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

export default AcercaDe;
