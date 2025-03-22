
//V1.2

import React, { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa'; 
import { jwtDecode } from 'jwt-decode';
import { Container, Nav, Navbar, Table, Button, Dropdown, Modal,Form } from 'react-bootstrap';
import axios from 'axios';

const AdminUsers = () => {
  const [userMetrics, setUserMetrics] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [newAdminData, setNewAdminData] = useState({ name: '', email: '', password: '' });
  const [currentuserEmail, setCurrentUserEmail] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null); // Store the current user's ID

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const handleDeleteUser = async (userId) => {
    if (userId === currentUserId) {
      alert('No puedes eliminar tu propio usuario.');
      return;
    }

    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/adminuser/users/${userId}`);
        setUserMetrics(userMetrics.filter(user => user._id !== userId));
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleRegisterAdmin = async () => {
    try {
      await axios.post('${process.env.REACT_APP_API_URL}/api/adminuser/register', {
        name: newAdminData.name,
        email: newAdminData.email,
        numtel: newAdminData.numtel,
        password: newAdminData.password,
        usertype: 'admin',
      });
      setShowRegisterModal(false);
      // Optionally, refresh user list after registration
    } catch (error) {
      console.error('Error registering admin user:', error);
    }
  };

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

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    const fetchUserMetrics = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/adminuser/users`);
        setUserMetrics(response.data);
      } catch (error) {
        console.error('Error fetching user metrics:', error);
      }
    };

    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('token');
      try {
        const decodedToken = jwtDecode(token);
        //console.log('Decoded Token:', decodedToken);
        //console.log(decodedToken.id);
        setCurrentUserId(decodedToken.id); // Store the current user's ID
        //console.log('Current User ID:',currentUserId);
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };
  

    fetchUserMetrics();
    fetchCurrentUser();
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
        <h1>Añade nuevos administradores:</h1>
        <p></p>
        <Button onClick={() => setShowRegisterModal(true)}>Registrar nuevo admin</Button>
        <p></p>
        <h1>Listado de usuarios registrados:</h1>
        <h3>(Incluyendo administradores)</h3>
        <p></p>
        <Table striped bordered hover responsive variant={isDarkMode ? 'dark' : 'light'}>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Correo</th>
              <th>Numero telefonico</th>
              <th>ID Dispositivo primario</th>
              <th>Tipo de usuario</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {userMetrics.map((user, index) => (
              <tr key={index}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.numtel}</td>
                <td>{user.iddispositivo}</td>
                <td>{user.usertype}</td>
                <td>
                  <Button variant="danger" onClick={() => handleDeleteUser(user._id)}>Eliminar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>

      <Modal show={showRegisterModal} onHide={() => setShowRegisterModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Registrar nuevo admin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Nombre de usuario</Form.Label>
              <Form.Control
                type="text"
                value={newAdminData.name}
                onChange={(e) => setNewAdminData({ ...newAdminData, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control
                type="email"
                value={newAdminData.email}
                onChange={(e) => setNewAdminData({ ...newAdminData, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formNumtel">
              <Form.Label>Numero Telefonico</Form.Label>
              <Form.Control
                type="text"
                value={newAdminData.numtel}
                onChange={(e) => setNewAdminData({ ...newAdminData, numtel: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                value={newAdminData.password}
                onChange={(e) => setNewAdminData({ ...newAdminData, password: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRegisterModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleRegisterAdmin}>Registrar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminUsers;
