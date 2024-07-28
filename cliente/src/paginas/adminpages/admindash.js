import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Nav, Tab, Card, NavDropdown, Button, Navbar, Table, Form } from 'react-bootstrap';
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
        const response = await axios.get('http://localhost:4000/api/admin/usermetrics');
        setUserMetrics(response.data);
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

  return (
    <div>
      <Container className="mt-5">
        <Navbar bg="light" expand="lg" fixed="top">
          <Container>
            <Navbar.Brand href="/">Admin Dashboard</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ml-auto">
                <Nav.Link href='/admin/dashboard'>Overview</Nav.Link>
                <Nav.Link href='/admin/users'>Users</Nav.Link>
                <Nav.Link href='/admin/settings'>Settings</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Tab.Container id="admin-dashboard-tabs" defaultActiveKey="Overview">
          <Row>
            <Col md={12}>
              <Tab.Content>
                <Tab.Pane eventKey="Overview">
                  <h2>Admin Overview</h2>
                  <Row>
                    <Col md={6}>
                      <WelcomeCard
                        title="User Metrics"
                        description="Overview of user activity and metrics"
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

      <footer className="fixed-bottom text-center py-2 bg-light">
        <Button variant="outline-secondary" onClick={handleLogout}>
          Logout
        </Button>
      </footer>
    </div>
  );
};

export default AdminDashboard;
