// import React, { useEffect,useState } from 'react';
// import { Container, Row, Col, Button, Navbar, Nav } from 'react-bootstrap';

// const Inicio = () => {
//   const [isDarkMode, setIsDarkMode] = useState(false);

//   useEffect(() => {
//     const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

//     if (prefersDarkScheme.matches) {
//       document.body.classList.add('dark-mode');
//       setIsDarkMode(true);
//     } else {
//       document.body.classList.remove('dark-mode');
//       setIsDarkMode(false);
//     }

//     const handleDarkModeChange = (e) => {
//       if (e.matches) {
//         document.body.classList.add('dark-mode');
//         setIsDarkMode(true);
//       } else {
//         document.body.classList.remove('dark-mode');
//         setIsDarkMode(false);
//       }
//     };

//     prefersDarkScheme.addEventListener('change', handleDarkModeChange);

//     return () => {
//       prefersDarkScheme.removeEventListener('change', handleDarkModeChange);
//     };
//   }, []);
//   return (
//     <>
//       <Navbar className={isDarkMode ? 'navbar-dark-mode' : 'navbar-light'} expand="lg" fixed="top">
//         <Container>
//           <Navbar.Brand href="/">SiNoMoto</Navbar.Brand>
//           <Navbar.Toggle aria-controls="basic-navbar-nav" />
//           <Navbar.Collapse id="basic-navbar-nav">
//             <Nav className="ml-auto">
//               <Nav.Link href="/modfis">Modulo</Nav.Link>
//               <Nav.Link href="/acercade">Acerca de Nosotros</Nav.Link>
//               <Nav.Link href="/signup">Registrarse</Nav.Link>
//               <Nav.Link href="/login">Iniciar Sesion</Nav.Link>
//             </Nav>
//           </Navbar.Collapse>
//         </Container>
//       </Navbar>

//       <Container className="mt-5">
//         <Row className="justify-content-center">
//           <Col md={8} className="text-center">
//             <h1>Gracias por visitar SiNoMoto</h1>
//             <p className="lead">
//               SiNoMoto es un prototipo de un sistema de notificación en caso de accidentes para motocicletas
//             </p>
//           </Col>
//         </Row>

//         <Row className="mt-5">
//           <Col md={6}>
//             <img
//               src="https://via.placeholder.com/600x400"
//               alt="Product Showcase"
//               className="img-fluid rounded"
//             />
//           </Col>
//           <Col md={6}>
//             <h2>Modulo Fisico</h2>
//             <p>
//               Conoce más acerca de nuestro modulo fisico y como interactua con tu motocicleta
//             </p>
//             <Button variant="primary" href="/modfis">
//               Learn More
//             </Button>
//           </Col>
//         </Row>

//         <Row className="mt-5">
//           <Col className="text-center">
//             <h2>Quienes somos?</h2>
//             <p>
//               Conoce nuestros objetivos con este prototipo
//             </p>
//             <Button variant="outline-primary" href="/acercade">
//               Acerca de nosotros
//             </Button>
//           </Col>
//         </Row>

//         <Row className="mt-5">
//           <Col className="text-center">
//             <h2>Cuentas con un modulo fisico?</h2>
//             <p>
//               Continua con el proceso registrandote a continuación
//             </p>
//             <Button variant="success" href="/signup">
//               Registrarse
//             </Button>
//           </Col>
//         </Row>
//       </Container>

//       <footer className={isDarkMode ? 'footer-dark-mode' : 'footer-light'}>
//       <Container>
//         <p className="footer-text">© 2025 SiNoMoto. PT2</p>
//       </Container>
//     </footer>
//     </>
//   );
// };

// export default Inicio;

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
        className={isDarkMode ? 'navbar-dark-mode' : 'navbar-light'}
        expand="lg"
        fixed="top"
        variant={isDarkMode ? 'dark' : 'light'}
        bg={isDarkMode ? 'dark' : 'light'}
      >
        <Container>
          <Navbar.Brand href="/" className="fw-bold fs-4">SiNoMoto</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
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
      <Container fluid className="mt-5 pt-5 text-center bg-dark p-5 rounded shadow-sm">
        <h1 className="display-5 fw-bold">Bienvenido a SiNoMoto</h1>
        <p className="lead">Un sistema inteligente de notificación ante accidentes para motocicletas.</p>
        <Button variant="primary" size="lg" href="/signup">Comenzar</Button>
      </Container>

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
