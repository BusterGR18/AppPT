import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Container, Nav, Navbar, Table, Form, Button, NavDropdown, Dropdown, Alert } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

const Contactos = () => {
  const [contactName, setContactName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [contacts, setContacts] = useState([]);
  const [userEmail, setUserEmail] = useState(null);
  const [editingContact, setEditingContact] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [settings, setSettings] = useState(null);

  const history = useHistory();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      history.push('/login');
    } else {
      const decodedToken = jwtDecode(token);
      setUserEmail(decodedToken.email);
      fetchSettings(decodedToken.email);
    }
  }, [history]);

  useEffect(() => {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    if (prefersDarkScheme.matches) {
      document.body.classList.add('dark-mode');
      setIsDarkMode(true);
    } else {
      document.body.classList.remove('dark-mode');
      setIsDarkMode(false);
    }

    prefersDarkScheme.addEventListener('change', (e) => {
      document.body.classList.toggle('dark-mode', e.matches);
      setIsDarkMode(e.matches);
    });

    return () => {
      prefersDarkScheme.removeEventListener('change', (e) => {
        document.body.classList.toggle('dark-mode', e.matches);
      });
    };
  }, []);

  const fetchSettings = async (email) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/settings/?useremail=${email}`);
      setSettings(response.data);
      if (!response.data.enableGuestMode) {
        fetchContacts(email);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const fetchContacts = async (userEmail) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/contacts/?useremail=${userEmail}`);
      setContacts(response.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const handleAddContact = async () => {
    try {
      const newContact = { alias: contactName, number: contactNumber, useremail: userEmail };
      const response = await axios.post('http://localhost:4000/api/contacts', newContact);
      setContacts([...contacts, response.data]);
      setContactName('');
      setContactNumber('');
    } catch (error) {
      console.error('Error adding contact:', error);
    }
  };

  const handleDeleteContact = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/contacts/${id}`);
      setContacts(contacts.filter((contact) => contact._id !== id));
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setContactName(contact.alias);
    setContactNumber(contact.number);
  };

  const handleUpdateContact = async () => {
    try {
      const updatedContact = { alias: contactName, number: contactNumber };
      const response = await axios.put(`http://localhost:4000/api/contacts/${editingContact._id}`, updatedContact);
      setContacts(contacts.map(contact => contact._id === editingContact._id ? response.data : contact));
      setEditingContact(null);
      setContactName('');
      setContactNumber('');
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    history.push('/login');
  };

  return (
    <div>
      <Navbar className={isDarkMode ? 'navbar-dark-mode' : 'navbar-light'} expand="lg" fixed="top">
        <Container className="navbar-container">
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

      <Container className={`mt-5 ${isDarkMode ? 'container-dark' : 'container'}`}>
        <h1>Contactos</h1>

        {settings?.enableGuestMode ? (
          <Alert variant="warning">
            <strong>⚠ Esta funcionalidad está restringida cuando habilitas el modo de invitado ⚠</strong>
          </Alert>
        ) : (
          <>
            <h2>{editingContact ? 'Editar Contacto' : 'Agregar Contacto Nuevo'}</h2>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Alias del Contacto</th>
                  <th>Número del Contacto</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <Form.Control
                      type="text"
                      placeholder="Alias del Contacto"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="text"
                      placeholder="Número del Contacto"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                    />
                  </td>
                  <td>
                    {editingContact ? (
                      <Button variant="primary" onClick={handleUpdateContact}>
                        Actualizar
                      </Button>
                    ) : (
                      <Button variant="primary" onClick={handleAddContact}>
                        Agregar
                      </Button>
                    )}
                  </td>
                </tr>
              </tbody>
            </Table>

            <h2>Visualizar Contactos</h2>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Alias del Contacto</th>
                  <th>Número del Contacto</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr key={contact._id}>
                    <td>{contact._id}</td>
                    <td>{contact.alias}</td>
                    <td>{contact.number}</td>
                    <td>
                      <Button variant="info" onClick={() => handleEditContact(contact)}>
                        Editar
                      </Button>{' '}
                      <Button variant="danger" onClick={() => handleDeleteContact(contact._id)}>
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}
      </Container>
    </div>
  );
};

export default Contactos;
