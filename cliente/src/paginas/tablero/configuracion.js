
//1.7
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { FaUserCircle } from 'react-icons/fa'; 
import { Container, Nav, Navbar, Tab, Row, Col, Button, NavDropdown, Form, Table, Dropdown} from 'react-bootstrap';

const Configuracion = () => {
  const [settings, setSettings] = useState({ enableStatistics: false, enableGuestMode: false });
  const [userEmail, setUserEmail] = useState(null);
  const [guestProfiles, setGuestProfiles] = useState([]);
  const [selectedGuestProfile, setSelectedGuestProfile] = useState('');
  const [newProfile, setNewProfile] = useState({ name: '', email: '' });
  const [contacts, setContacts] = useState([]);
  const [contactName, setContactName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [editingContact, setEditingContact] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
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
          const response = await axios.get(`http://localhost:4000/api/settings/?useremail=${userEmail}`);
          setSettings(response.data);
        } catch (error) {
          console.error('Error fetching settings:', error);
        }
      };

      fetchSettings();
    }
  }, [userEmail]);

  useEffect(() => {
    if (settings.enableGuestMode) {
      const fetchGuestProfiles = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`http://localhost:4000/api/guest-profiles/?useremail=${userEmail}`);
          setGuestProfiles(response.data);
        } catch (error) {
          console.error('Error fetching guest profiles:', error);
        }
      };

      fetchGuestProfiles();
    }
  }, [settings.enableGuestMode, userEmail]);

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

  const handleProfileChange = (event) => {
    setSelectedGuestProfile(event.target.value);
  };

  const handleNewProfileChange = (event) => {
    const { name, value } = event.target;
    setNewProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
  };

  const handleNewProfileSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:4000/api/guest-profiles/?useremail=${userEmail}`, newProfile);
      setGuestProfiles((prevProfiles) => [...prevProfiles, newProfile]);
      setSelectedGuestProfile(newProfile.name);
      setNewProfile({ name: '', email: '' }); // Reset form
    } catch (error) {
      console.error('Error saving new guest profile:', error);
    }
  };

  const handleAddContact = () => {
    setContacts([...contacts, { name: contactName, number: contactNumber }]);
    setContactName('');
    setContactNumber('');
  };

  const handleEditContact = (index) => {
    setEditingContact(true);
    setEditIndex(index);
    setContactName(contacts[index].name);
    setContactNumber(contacts[index].number);
  };

  const handleUpdateContact = () => {
    const updatedContacts = [...contacts];
    updatedContacts[editIndex] = { name: contactName, number: contactNumber };
    setContacts(updatedContacts);
    setEditingContact(false);
    setContactName('');
    setContactNumber('');
    setEditIndex(null);
  };

  const handleDeleteContact = (index) => {
    const updatedContacts = contacts.filter((_, i) => i !== index);
    setContacts(updatedContacts);
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

      <Container className="mt-5">
        <p></p>
        <Tab.Container id="configuracion-tabs" defaultActiveKey="General">
          <Row>
            <Col sm={3}>
              <Nav variant="pills" className="flex-column">
                <Nav.Item>
                  <Nav.Link eventKey="General">General</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="Notifs">Notificaciones</Nav.Link>
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
                <Nav.Item>
                  <Nav.Link eventKey="AccSett">Configuración de cuenta</Nav.Link>
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
                <Tab.Pane eventKey="Notifs">
                  <h2>Ajustes de notificaciones</h2>
                </Tab.Pane>
                <Tab.Pane eventKey="Estadisticas">
                  <h2>Ajustes de estadisticas</h2>
                  {/* Additional settings related to statistics can be added here */}
                </Tab.Pane>
                <Tab.Pane eventKey="ModoInv">
                  <h2>Ajustes de modo de Invitado</h2>
                  <p>El modo de invitado esta pensado para habilitarse de forma temporal.</p>
                  <Form>
                    <Form.Group controlId="enableGuestMode">
                      <Form.Check
                        type="checkbox"
                        label="Habilitar Modo de invitado"
                        name="enableGuestMode"
                        checked={settings.enableGuestMode}
                        onChange={handleToggleChange}
                      />
                    </Form.Group>
                  </Form>
                  {settings.enableGuestMode ? (
                    <div>
                      <h4>Seleccione un perfil de invitado:</h4>
                      <Form.Group controlId="guestProfileSelect">
                        <Form.Control as="select" value={selectedGuestProfile} onChange={handleProfileChange}>
                          <option value="">Seleccionar perfil</option>
                          {guestProfiles.map((profile, index) => (
                            <option key={index} value={profile.name}>
                              {profile.name}
                            </option>
                          ))}
                          <option value="new">Nuevo perfil</option>
                        </Form.Control>
                      </Form.Group>
                      {selectedGuestProfile === 'new' && (
                        <div>
                          <h4>Datos del usuario del modo invitado</h4>
                          <Form onSubmit={handleNewProfileSubmit}>
                            <Form.Group controlId="newGuestName">
                              <Form.Label>Nombre</Form.Label>
                              <Form.Control
                                type="text"
                                name="name"
                                value={newProfile.name}
                                onChange={handleNewProfileChange}
                                required
                              />
                            </Form.Group>
                            <Form.Group controlId="newGuestEmail">
                              <Form.Label>Email</Form.Label>
                              <Form.Control
                                type="email"
                                name="email"
                                value={newProfile.email}
                                onChange={handleNewProfileChange}
                                required
                              />
                            </Form.Group>
                            <Form.Group controlId="newGuestPhoneNumber">
                              <Form.Label>Numero de telefono</Form.Label>
                              <Form.Control
                                type="phone number"
                                name="phonenumber"
                                value={newProfile.phonenumber}
                                onChange={handleNewProfileChange}
                                required
                              />
                            </Form.Group>
                            <Button type="submit">Guardar perfil</Button>
                          </Form>
    
                          <h4>Contactos del usuario del modo invitado</h4>
                          <Container className="mt-5">
                            <h5>{editingContact ? 'Editar Contacto' : 'Agregar Contacto Nuevo'}</h5>
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
                                {contacts.map((contact, index) => (
                                  <tr key={index}>
                                    <td>{contact.name}</td>
                                    <td>{contact.number}</td>
                                    <td>
                                      <Button variant="secondary" onClick={() => handleEditContact(index)}>
                                        Editar
                                      </Button>
                                      <Button variant="danger" onClick={() => handleDeleteContact(index)}>
                                        Eliminar
                                      </Button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                          </Container>
                          <h4>Rutas del usuario invitado</h4>
                          <p></p>
                          <h4>Mensaje personalizado del modo invitado</h4>
                          <p>Este mensaje es el utilizado para informar a sus contactos de emergencia</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div></div>
                  )}
                </Tab.Pane>
                <Tab.Pane eventKey="ModMgmt">
                  <h2>Tab 3 Content</h2>
                  <p>Content for Tab 3.</p>
                </Tab.Pane>
                <Tab.Pane eventKey="AccSett">
                  <h2>Cuenta</h2>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    </div>
);
};

export default Configuracion;    
