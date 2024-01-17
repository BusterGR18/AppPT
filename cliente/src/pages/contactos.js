import React from 'react';
import { Container, Row, Col, Nav, Tab, Card, Button, Navbar } from 'react-bootstrap';
const Contactos = () => {
    return(
        <Navbar bg="light" expand="lg" fixed="top">
        <Container>
          <Navbar.Brand href="/">SiNoMoto</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              <Nav.Link href='/dash'>Inicio</Nav.Link>
              <Nav.Link href='/contactos'>Contactos</Nav.Link>
              <Nav.Link href='/rutas'>Rutas</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

    );

};
export default Contactos;