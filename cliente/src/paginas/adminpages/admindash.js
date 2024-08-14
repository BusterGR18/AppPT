import React, { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa'; 
import { Container, Nav, Navbar, Tab, Row, Col, Button, NavDropdown, Form, Table, Dropdown, Card } from 'react-bootstrap';
import axios from 'axios';

const WelcomeCard = ({ title, description, children }) => (
  <Card>
    <Card.Body>
      <Card.Title>{title}</Card.Title>
      <Card.Text>{description}</Card.Text>
      {children}
    </Card.Body>
  </Card>
);

const AdminDashboard = () => {
  const [userMetrics, setUserMetrics] = useState([]);
  const [systemLogs, setSystemLogs] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    const fetchUserMetrics = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/adminuser/clients');
        setUserMetrics(response.data);
        setUserCount(response.data.length); // Update user count
      } catch (error) {
        console.error('Error fetching user metrics:', error);
      }
    };

    const fetchSystemLogs = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/admin/systemlogs');
        setSystemLogs(response.data);
      } catch (error) {
        console.error('Error fetching system logs:', error);
      }
    };

    fetchUserMetrics();
    fetchSystemLogs();
  }, []);

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
    <div>
      <Container className="mt-5">
        <Navbar className={isDarkMode ? 'navbar-dark-mode' : 'navbar-light'} expand="lg" fixed="top">
          <Container className="navbar-container">
            <Navbar.Brand href="/">SiNoMoto</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ml-auto">
                <Nav.Link href='/admindash'>Vista general</Nav.Link>
                <Nav.Link href='/adminusers'>Usuarios</Nav.Link>
                <Nav.Link href='/admintelemetry'>Telemetria general</Nav.Link>
                <Nav.Link href='/adminsettings'>Configuración</Nav.Link>
                <Dropdown className="profile-dropdown" align="items-end">
                  <Dropdown.Toggle variant="link" id="profile-dropdown">
                    <FaUserCircle size={24} color="#fff" />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={handleLogout}>Cerrar Sesión</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>  
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Tab.Container id="admin-dashboard-tabs" defaultActiveKey="Overview">
          <Row>
            <Col md={12}>
              <Tab.Content>
                <Tab.Pane eventKey="Overview">
                  <h2>Bienvenido</h2>
                  <Row>
                    <Col md={6}>
                      <WelcomeCard
                        title="Usuarios del sistema"
                        description={`Total de usuarios registrados: ${userCount}`}
                      >
                        <Table striped bordered hover>
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Metric</th>
                              <th>Value</th>
                            </tr>
                          </thead>
                          <tbody>
                            {userMetrics.map((metric, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{metric.name}</td>
                                <td>{metric.value}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </WelcomeCard>
                    </Col>
                    <Col md={6}>
                      <WelcomeCard
                        title="System Logs"
                        description="Recent system activity logs"
                      >
                        <Table striped bordered hover>
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Timestamp</th>
                              <th>Log</th>
                            </tr>
                          </thead>
                          <tbody>
                            {systemLogs.map((log, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{log.timestamp}</td>
                                <td>{log.message}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </WelcomeCard>
                    </Col>
                  </Row>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    </div>
  );
};

export default AdminDashboard;
