/*import logo from './logo.svg';
import './App.css';


function Inicio() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload. a mamarre
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default Inicio;
//V2
import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

const Inicio = () => {
  return (
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
          <h2>Featured Product</h2>
          <p>
            Explore our featured product that brings innovation and convenience to your life.
          </p>
          <Button variant="primary" href="/product-details">
            Learn More
          </Button>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col className="text-center">
          <h2>Quienes somos?</h2>
          <p>
            Discover the reasons why our product is the perfect choice for your needs.
          </p>
          <Button variant="outline-primary" href="/about-us">
            Acerca de nosotros
          </Button>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col className="text-center">
          <h2>Cuentas con un modulo fisico?</h2>
          <p>
            Continua con el proceso registrandote a continuación           </p>
          <Button variant="success" href="/signup">
            Registrarse
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Inicio;
*/
import React from 'react';
import { Container, Row, Col, Button, Navbar, Nav } from 'react-bootstrap';

const Inicio = () => {
  return (
    <>
      <Navbar bg="light" expand="lg" fixed="top">
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

      <Navbar bg="light">
        <Container>
          <Navbar.Text>
            © 2024 SiNoMoto. PT2
          </Navbar.Text>
        </Container>
      </Navbar>
    </>
  );
};

export default Inicio;

