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

const AdminSettings = () => {
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
                <Nav.Link href='/admindash'>Overview</Nav.Link>
                <Nav.Link href='/adminusers'>Users</Nav.Link>
                <Nav.Link href='/adminsettings'>Settings</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

      </Container>

      <footer className="fixed-bottom text-center py-2 bg-light">
        <Button variant="outline-secondary" onClick={handleLogout}>
          Logout
        </Button>
      </footer>
    </div>
  );
};

export default AdminSettings;
