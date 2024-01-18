/*import React from 'react';
import { Container, Row, Col, Nav, Tab, Card, Button, Navbar } from 'react-bootstrap';
const Configuracion= () => {
    return(
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
    <footer className="fixed-bottom text-center py-2 bg-light">
      <Button variant="outline-secondary" >
        Cerrar Sesión
      </Button>
    </footer>
    </div>
    );

};
export default Configuracion;
*/
import React from 'react';
import { Container, Nav, Navbar, Tab, Row, Col, Button } from 'react-bootstrap';

const Configuracion = () => {
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

      <Container className="mt-5">
        <Tab.Container id="configuracion-tabs" defaultActiveKey="placeholder">
          <Row>
            <Col sm={3}>
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="placeholder">Placeholder</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="tab1">Tab 1</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="tab2">Tab 2</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="tab3">Tab 3</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={9}>
              <Tab.Content>
                <Tab.Pane eventKey="placeholder">
                  <h2>Placeholder Inical</h2>
                  <p>Placeholder para el futuro</p>
                </Tab.Pane>
                <Tab.Pane eventKey="tab1">
                  <h2>Tab 1 Content</h2>
                  <p>Content for Tab 1.</p>
                </Tab.Pane>
                <Tab.Pane eventKey="tab2">
                  <h2>Tab 2 Content</h2>
                  <p>Content for Tab 2.</p>
                </Tab.Pane>
                <Tab.Pane eventKey="tab3">
                  <h2>Tab 3 Content</h2>
                  <p>Content for Tab 3.</p>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>

      <footer className="fixed-bottom text-center py-2 bg-light">
        <Button variant="outline-secondary">Cerrar Sesión</Button>
      </footer>
    </div>
  );
};

export default Configuracion;
