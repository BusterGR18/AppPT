/*import React, { useEffect } from 'react';
import { Container, Nav, Navbar, Tab, Row, Col, Button,NavDropdown } from 'react-bootstrap';

const Configuracion = () => {
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
              <NavDropdown title="Rutas" id="basic-nav-dropdown">
                <NavDropdown.Item href="/registerruta">Registrar Nueva Ruta</NavDropdown.Item>
                <NavDropdown.Item href="/viewrutas">Visualizar Rutas Existentes</NavDropdown.Item>
                <NavDropdown.Item href="/deleterutas">Eliminar Rutas</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link href='/estadisticas'>Estadisticas</Nav.Link>
              <Nav.Link href='/configuracion'>Configuración</Nav.Link>          
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-5">
        <hr></hr>
        <Tab.Container id="configuracion-tabs" defaultActiveKey="placeholder">
          <Row>
            <Col sm={3}>
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="General">General</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="ModoInv">Modo de Invitado</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="Estadisticas">Estadisticas</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="ModMgmt">Administración de modulos</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={9}>
              <Tab.Content>
                <Tab.Pane eventKey="General">
                  <h2>Placeholder Inical</h2>
                  <p>Placeholder para el futuro</p>
                </Tab.Pane>
                <Tab.Pane eventKey="ModoInv">
                  <h2>Tab 1 Content</h2>
                  <p>Content for Tab 1.</p>
                </Tab.Pane>
                <Tab.Pane eventKey="Estadisticas">
                  <h2>Tab 2 Content</h2>
                  <p>Content for Tab 2.</p>
                </Tab.Pane>
                <Tab.Pane eventKey="ModMgmt">
                  <h2>Tab 3 Content</h2>
                  <p>Content for Tab 3.</p>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>

      <footer className="fixed-bottom text-center py-2 bg-light">
      <Button variant="outline-secondary" onClick={handleLogout}>
        Cerrar Sesión
      </Button>
      </footer>
    </div>
  );
};

export default Configuracion;
*/
/*
//V1.5
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { Container, Nav, Navbar, Tab, Row, Col, Button, NavDropdown, Form } from 'react-bootstrap';

const Configuracion = () => {
  const [settings, setSettings] = useState({ enableStatistics: false });
  const [userEmail, setUserEmail] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const isAuthenticated = localStorage.getItem('token') !== null;

    if (!isAuthenticated) {
      window.location.href = '/login';
    } else {
      const decodedToken = jwtDecode(token);
      console.log('Decoded Token:', decodedToken);
      setUserEmail(decodedToken.email);
      console.log(userEmail)      
    }

    const fetchSettings = async () => {
      const response = await axios.get(`http://localhost:4000/api/settings/?useremail=${userEmail}`);      
      setSettings(response.data);
    };

    fetchSettings();
  }, []);

  const handleToggleChange = async (event) => {
    const { name, checked } = event.target;
    const updatedSettings = { ...settings, [name]: checked };
    setSettings(updatedSettings);
    await axios.post('http://localhost:4000/api/settings', updatedSettings);
    
  };

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
              <NavDropdown title="Rutas" id="basic-nav-dropdown">
                <NavDropdown.Item href="/registerruta">Registrar Nueva Ruta</NavDropdown.Item>
                <NavDropdown.Item href="/viewrutas">Visualizar Rutas Existentes</NavDropdown.Item>
                <NavDropdown.Item href="/deleterutas">Eliminar Rutas</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link href='/estadisticas'>Estadisticas</Nav.Link>
              <Nav.Link href='/configuracion'>Configuración</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-5">
        <hr />
        <Tab.Container id="configuracion-tabs" defaultActiveKey="General">
          <Row>
            <Col sm={3}>
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="General">General</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="Estadisticas">Estadisticas</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="ModoInv">Modo de Invitado</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="ModMgmt">Administración de modulos</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={9}>
              <Tab.Content>
                <Tab.Pane eventKey="General">
                  <h2>Ajustes Generales</h2>
                  <Form>
                    <Form.Group controlId="enableStatistics">
                      <Form.Check
                        type="checkbox"
                        label="Habilitar estadisticas"
                        name="enableStatistics"
                        checked={settings.enableStatistics}
                        onChange={handleToggleChange}
                      />
                    </Form.Group>
                  </Form>
                </Tab.Pane>
                <Tab.Pane eventKey="Estadisticas">
                  <h2>Ajustes de estadisticas</h2>
                  
                </Tab.Pane>
                <Tab.Pane eventKey="ModoInv">
                  <h2>Tab 1 Content</h2>
                  <p>Content for Tab 1.</p>
                </Tab.Pane>
                <Tab.Pane eventKey="ModMgmt">
                  <h2>Tab 3 Content</h2>
                  <p>Content for Tab 3.</p>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>

      <footer className="fixed-bottom text-center py-2 bg-light">
        <Button variant="outline-secondary" onClick={handleLogout}>
          Cerrar Sesión
        </Button>
      </footer>
    </div>
  );
};

export default Configuracion;
*/
//1.6
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Ensure proper import
import { Container, Nav, Navbar, Tab, Row, Col, Button, NavDropdown, Form } from 'react-bootstrap';

const Configuracion = () => {
  const [settings, setSettings] = useState({ enableStatistics: false });
  const [userEmail, setUserEmail] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const isAuthenticated = token !== null;

    if (!isAuthenticated) {
      window.location.href = '/login';
    } else {
      const decodedToken = jwtDecode(token);
      setUserEmail(decodedToken.email);
      console.log(userEmail);
    }
  }, []);

  useEffect(() => {
    if (userEmail) {
      const fetchSettings = async () => {
        try {
          const token = localStorage.getItem('token');
          //const response = await axios.get('http://localhost:4000/api/settings');
          const response = await axios.get(`http://localhost:4000/api/settings/?useremail=${userEmail}`);
          setSettings(response.data);
        } catch (error) {
          console.error('Error fetching settings:', error);
        }
      };

      fetchSettings();
    }
  }, [userEmail]); // Depend on userEmail to fetch settings after it is set

  const handleToggleChange = async (event) => {
    const { name, checked } = event.target;
    const updatedSettings = { ...settings, [name]: checked };
    setSettings(updatedSettings);

    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:4000/api/settings/?useremail=${userEmail}`, updatedSettings);
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

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
              <NavDropdown title="Rutas" id="basic-nav-dropdown">
                <NavDropdown.Item href="/registerruta">Registrar Nueva Ruta</NavDropdown.Item>
                <NavDropdown.Item href="/viewrutas">Visualizar Rutas Existentes</NavDropdown.Item>
                <NavDropdown.Item href="/deleterutas">Eliminar Rutas</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link href='/estadisticas'>Estadisticas</Nav.Link>
              <Nav.Link href='/configuracion'>Configuración</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-5">
        <hr />
        <Tab.Container id="configuracion-tabs" defaultActiveKey="General">
          <Row>
            <Col sm={3}>
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="General">General</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="Estadisticas">Estadisticas</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="ModoInv">Modo de Invitado</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="ModMgmt">Administración de modulos</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={9}>
              <Tab.Content>
                <Tab.Pane eventKey="General">
                  <h2>Ajustes Generales</h2>
                  <Form>
                    <Form.Group controlId="enableStatistics">
                      <Form.Check
                        type="checkbox"
                        label="Habilitar estadisticas"
                        name="enableStatistics"
                        checked={settings.enableStatistics}
                        onChange={handleToggleChange}
                      />
                    </Form.Group>
                  </Form>
                </Tab.Pane>
                <Tab.Pane eventKey="Estadisticas">
                  <h2>Ajustes de estadisticas</h2>
                  {/* Additional settings related to statistics can be added here */}
                </Tab.Pane>
                <Tab.Pane eventKey="ModoInv">
                  <h2>Tab 1 Content</h2>
                  <p>Content for Tab 1.</p>
                </Tab.Pane>
                <Tab.Pane eventKey="ModMgmt">
                  <h2>Tab 3 Content</h2>
                  <p>Content for Tab 3.</p>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>

      <footer className="fixed-bottom text-center py-2 bg-light">
        <Button variant="outline-secondary" onClick={handleLogout}>
          Cerrar Sesión
        </Button>
      </footer>
    </div>
  );
};

export default Configuracion;
