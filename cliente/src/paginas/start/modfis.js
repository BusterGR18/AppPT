/*import React, { useEffect,useState } from 'react';
import { Container, Row, Col, Button, Navbar, Nav } from 'react-bootstrap';

const ProductDetails = () => {
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
          <h1>Detalles del sistema</h1>
          <p className="lead">
            Nuestro sistema ofrece una solución de seguridad para tí y tú motocicleta que opera sin necesidad de otro dispositivo inteligente
          </p>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col md={6}>
          <img
            src="https://64.media.tumblr.com/bef61f8cb7f9791503727fc26cff0925/31511d3136396c71-20/s500x750/f2ac4fa1f8ff862e71336987076abc0b010a25b8.png"
            alt="Imagen modulo"
            className="img-fluid rounded" />
        </Col>
        <Col md={6}>
          <h2>Modulo</h2>
          <p>
            En esta fase de prototipo nuestro modulo está construido en el menor espacio posible sin afectar a sus componentes internos
          </p>
          <ul>
            <li>Dos unidades de bateria de 5000MAh</li>
            <li>Conectividad LTE con los operadores más grandes del pais</li>
            <li>Diseño que protege el dispositivo en caso de accidentes</li>
          </ul>
          <Button variant="primary">
            Comprar Ahora
          </Button>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col md={12} className="text-center">
          <h2>Beneficios Clave</h2>
          <ul>
            <li>Beneficio 1: Detección automatica de accidentes.</li>
            <li>Beneficio 2: Detección de salida de geocerco automatica. </li>
            <li>Beneficio 3: Notifica a familiares y amigos de forma personalizada mediante SMS y/o Whatsapp. </li>
          </ul>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col md={12} className="text-center">
          <h2>Opiniones de Clientes</h2>
          <p>
            "Maecenas rutrum nisl lorem, id aliquet sapien pretium non. " - Mamberroi
          </p>
          <p>
            "nteger ac tortor eu felis bibendum feugiat vel eget erat. Duis at suscipit lacus, quis euismod nibh. Duis volutpat ultrices porta. " - Danny Flow
          </p>
        </Col>
      </Row>
    </Container><footer className={isDarkMode ? 'footer-dark-mode' : 'footer-light'}>
        <Container>
          <p className="footer-text">© 2025 SiNoMoto. PT2</p>
        </Container>
      </footer></>
  );
};

export default ProductDetails;
*/


import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Navbar, Nav, Card } from 'react-bootstrap';

const ProductDetails = () => {
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


      {/* Hero Section */}
      <div style={{ paddingTop: '64px' }}>
        <Container
          fluid
          className={`text-center p-4 rounded shadow-sm ${
            isDarkMode ? 'bg-dark text-light' : 'bg-light text-dark'
          }`}
        >
        <h1 className="display-4 fw-bold">Protección Total para Tu Motocicleta</h1>
        <p className="lead">Tecnología inteligente que actúa cuando tú no puedes</p>
        <Button variant="primary" size="lg">Ver Detalles</Button>
      </Container></div>

      {/* Product Details */}
      <Container className="mt-5">
        <Row className="align-items-center g-5">
          <Col md={6}>
            <img
              src="https://64.media.tumblr.com/bef61f8cb7f9791503727fc26cff0925/31511d3136396c71-20/s500x750/f2ac4fa1f8ff862e71336987076abc0b010a25b8.png"
              alt="Imagen modulo"
              className="img-fluid rounded shadow"
            />
          </Col>
          <Col md={6}>
            <h2 className="fw-bold">Nuestro Módulo</h2>
            <p>Compacto, robusto y preparado para cualquier emergencia.</p>
            <ul>
              <li>2 baterías de 5000mAh</li>
              <li>LTE con cobertura nacional</li>
              <li>Protección anti-impacto</li>
            </ul>
            <Button variant="success" size="md">Comprar Ahora</Button>
          </Col>
        </Row>

        {/* Benefits */}
        <Row className="mt-5 text-center">
          <h2 className="fw-bold mb-4">Beneficios Clave</h2>
          {['Detección de accidentes', 'Salida de geocerco', 'Notificaciones automáticas a contactos'].map((b, i) => (
            <Col md={4} key={i}>
              <Card className="shadow-sm mb-4">
                <Card.Body>
                  <Card.Title>{`Beneficio ${i + 1}`}</Card.Title>
                  <Card.Text>{b}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Testimonials */}
        <Row className="mt-5">
          <Col md={12} className="text-center">
            <h2 className="fw-bold">Opiniones de Clientes</h2>
            <blockquote className="blockquote">
              <p>"Este sistema me dio tranquilidad al instante." - Mamberroi</p>
            </blockquote>
            <blockquote className="blockquote">
              <p>"Fácil de instalar y confiable, ¡una joya tecnológica!" - Danny Flow</p>
            </blockquote>
          </Col>
        </Row>
      </Container>

      {/* Footer */}
      <footer className={isDarkMode ? 'footer-dark-mode' : 'footer-light'}>
        <Container className="text-center py-4">
          <p className="footer-text mb-0">© 2025 SiNoMoto. PT2. Todos los derechos reservados.</p>
        </Container>
      </footer>
    </>
  );
};

export default ProductDetails;
