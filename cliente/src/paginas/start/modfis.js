import React, { useEffect,useState } from 'react';
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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec bibendum magna lacus, a fermentum ipsum cursus sed. Vestibulum
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
            Donec lorem augue, elementum hendrerit felis sed, congue porttitor urna. Integer eleifend elementum ultricies. Aenean felis lacus, venenatis et imperdiet id, feugiat rutrum tellus.
          </p>
          <ul>
            <li>Característica 1</li>
            <li>Característica 2</li>
            <li>Característica 3</li>
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
            <li>Beneficio 1: usce imperdiet nulla semper justo aliquet, in consequat nisi accumsan.</li>
            <li>Beneficio 2: unc gravida dui porta, gravida felis eget, molestie velit. Praesent a aliquet lacus, quis interdum orci. </li>
            <li>Beneficio 3: Vestibulum vitae neque justo. Cras blandit sapien vel lacus maximus mattis sed et leo. </li>
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
          <p className="footer-text">© 2024 SiNoMoto. PT2</p>
        </Container>
      </footer></>
  );
};

export default ProductDetails;
