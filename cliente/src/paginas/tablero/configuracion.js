//v1.9
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { FaUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Container, Nav, Navbar, Tab, Row, Col, Button, NavDropdown, Form,  Dropdown ,Table} from 'react-bootstrap';

const Configuracion = () => {
  const [settings, setSettings] = useState({
    enableStatistics: false,
    enableGuestMode: false,
    enableCustomNotificationMessage: false,
    customNotificationMessage: "",
    notifications: { whatsapp: false, sms: false, telegram: false },
    displayStatistics: [] // Add displayStatistics to settings
  });
  const statisticDisplayNames = {
    distanceTraveled: "Distancia Recorrida",
    averageSpeed: "Velocidad Promedio",
    totalRideDuration: "Duración Total del Viaje",
    accidentCount: "Número de Accidentes",
    maxSpeed: "Velocidad Máxima",
    topLocations: "Lugares Más Visitados",
    guestModeStats: "Estadísticas del Modo Invitado",
  };
  const [userEmail, setUserEmail] = useState(null);
  const [guestProfiles, setGuestProfiles] = useState([]);
  const [selectedGuestProfile, setSelectedGuestProfile] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [availableStatistics, setAvailableStatistics] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [excludedContacts, setExcludedContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const handleToggleChange = async (event) => {
    const { name, checked } = event.target;
    const updatedSettings = { ...settings, [name]: checked };
    setSettings(updatedSettings);
  
    try {
      //const token = localStorage.getItem('token');
      await axios.post(`http://localhost:4000/api/settings/?useremail=${userEmail}`, updatedSettings);
      console.log(`Settings updated: ${name} is now ${checked}`);
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  const handleNotificationChange = (event) => {
    const { name, type, checked, value } = event.target;
  
    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: type === "checkbox" ? checked : value, // Use value directly if it's not a checkbox
      notifications: {
        ...prevSettings.notifications,
        [name]: type === "checkbox" ? checked : prevSettings.notifications[name]
      }
    }));
  };

  const handleSaveSettings = async () => {
    try {
      //const token = localStorage.getItem('token');
      await axios.post(`http://localhost:4000/api/settings/?useremail=${userEmail}`, settings);
      alert("Settings saved successfully!");
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handleProfileChange = async (event) => {
    const selectedProfileId = event.target.value;
    setSelectedGuestProfile(selectedProfileId);
  
    // Update settings with the selected profile _id and save to the backend
    const updatedSettings = { ...settings, selectedGuestProfile: selectedProfileId };
    setSettings(updatedSettings);
  
    try {
      //const token = localStorage.getItem('token');
      await axios.post(`http://localhost:4000/api/settings/?useremail=${userEmail}`, updatedSettings);
      console.log(`Guest profile selected: ${selectedProfileId}`);
    } catch (error) {
      console.error('Error saving selected guest profile:', error);
    }
  };

  const handleCheckboxChange = (statistic) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      displayStatistics: prevSettings.displayStatistics.includes(statistic)
        ? prevSettings.displayStatistics.filter((s) => s !== statistic)
        : [...prevSettings.displayStatistics, statistic]
    }));
  };
  
  const handleExcludeContact = (contactId) => {
    setExcludedContacts((prevExcluded) =>
      prevExcluded.includes(contactId)
        ? prevExcluded.filter((id) => id !== contactId)
        : [...prevExcluded, contactId]
    );
  };

  const saveExcludedContacts = async () => {
    setIsLoading(true);
    try {
      await axios.post('http://localhost:4000/api/settings/updateExcludedContacts', {
        useremail: userEmail, // Change to lowercase `useremail` to match the backend
        excludedContactIds: excludedContacts, // Adjust the key to `excludedContactIds`
      });            
      alert('Tus cambios han sido guardados exitosamente.');
    } catch (error) {
      console.error('Error saving excluded contacts:', error);
      alert('Ocurrio un error al guardar tus cambios');
    } finally {
      setIsLoading(false);
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

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
    } else {
      const decodedToken = jwtDecode(token);
      setUserEmail(decodedToken.email);
    }
  }, []);

  useEffect(() => {
    if (userEmail) {

      const fetchAvailableStatistics = async () => {
        try {
          const response = await axios.get('http://localhost:4000/api/statistics/available');
          setAvailableStatistics(response.data);
        } catch (error) {
          console.error("Error fetching available statistics:", error);
        }
      };
      const fetchSettings = async () => {
        try {
          const response = await axios.get(`http://localhost:4000/api/settings/?useremail=${userEmail}`);
          setSettings(response.data);
          setSelectedGuestProfile(response.data.selectedGuestProfile || "");
        } catch (error) {
          console.error('Error fetching settings:', error);
        }
      };

      const fetchContactsAndExcluded = async () => {
        try {
          // Fetch all contacts
          const contactsResponse = await axios.get(`http://localhost:4000/api/contacts/?useremail=${userEmail}`);
          setContacts(contactsResponse.data);
      
          // Fetch settings including excluded contacts
          const settingsResponse = await axios.get(`http://localhost:4000/api/settings/?useremail=${userEmail}`);
          //console.log('Settings Response:', settingsResponse.data); // Debugging log
          
          const excludedContactIds = settingsResponse.data.excludedContacts || [];
          //console.log('Excluded Contacts on Page Load:', excludedContactIds); // Debugging log
          
          setExcludedContacts(excludedContactIds);
        } catch (error) {
          console.error('Error fetching contacts or excluded contacts:', error);
        }
      };
      

      fetchAvailableStatistics();
      fetchSettings();
      fetchContactsAndExcluded();

    }
  }, [userEmail]);

  useEffect(() => {
    //console.log('Excluded Contacts on Page Load:', excludedContacts);
  }, [excludedContacts]);
  

  useEffect(() => {
    if (settings.enableGuestMode) {
      const fetchGuestProfiles = async () => {
        try {
          const response = await axios.get(`http://localhost:4000/api/guest-profiles/?useremail=${userEmail}`);
          setGuestProfiles(response.data);
        } catch (error) {
          console.error('Error fetching guest profiles:', error);
        }
      };

      fetchGuestProfiles();
    }
  }, [settings.enableGuestMode, userEmail]);

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
        <Tab.Container id="configuracion-tabs" defaultActiveKey="General">
          <Row>
            <Col sm={3}>
              <Nav variant="pills" className="flex-column">
                <Nav.Item><Nav.Link eventKey="General">General</Nav.Link></Nav.Item>
                <Nav.Item><Nav.Link eventKey="Notifs">Notificaciones</Nav.Link></Nav.Item>
                <Nav.Item><Nav.Link eventKey="Estadisticas">Estadisticas</Nav.Link></Nav.Item>
                <Nav.Item><Nav.Link eventKey="ModoInv">Modo de Invitado</Nav.Link></Nav.Item>
                <Nav.Item><Nav.Link eventKey="ModMgmt">Administración de modulos</Nav.Link></Nav.Item>
                <Nav.Item><Nav.Link eventKey="AccSett">Configuración de cuenta</Nav.Link></Nav.Item>
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
                  <h3>Elige qué servicios deseas usar para las notificaciones</h3>
                  <Form>
                    <Form.Group controlId="notificationWhatsApp">
                      <Form.Check
                        type="checkbox"
                        label="WhatsApp"
                        name="whatsapp"
                        checked={settings.notifications.whatsapp}
                        onChange={handleNotificationChange}
                      />
                    </Form.Group>
                    <Form.Group controlId="notificationSMS">
                      <Form.Check
                        type="checkbox"
                        label="SMS"
                        name="sms"
                        checked={settings.notifications.sms}
                        onChange={handleNotificationChange}
                      />
                    </Form.Group>
                    <Form.Group controlId="notificationTelegram">
                      <Form.Check
                        type="checkbox"
                        label="Telegram"
                        name="telegram"
                        checked={settings.notifications.telegram}
                        onChange={handleNotificationChange}
                      />
                    </Form.Group>
                    <h3>Mensajes personalizados:</h3>
                    <Form.Group controlId="enableCustomNotificationMessage">
                      <Form.Check
                        type="checkbox"
                        label="Habilitar mensajes de notificación personalizado"
                        name="enableCustomNotificationMessage"
                        checked={settings.enableCustomNotificationMessage}
                        onChange={handleToggleChange}
                      />
                    </Form.Group>
                    {settings.enableCustomNotificationMessage && (
                      <Form.Group controlId="customNotificationMessage">
                        <Form.Label>Mensaje personalizado</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="customNotificationMessage"
                          value={settings.customNotificationMessage}
                          onChange={(e) => handleNotificationChange(e)}
                          placeholder="Escribe tu mensaje de notificación personalizado aquí"
                        />
                      </Form.Group>
                    )}
                    <Button variant="primary" onClick={handleSaveSettings}>
                      Guardar
                    </Button>
                  </Form>
                </Tab.Pane>
                <Tab.Pane eventKey="Estadisticas">
  <h2>Ajustes de tus estadísticas</h2>
  <h3>Estas son tus estadísticas disponibles, marca las que desees activar</h3>
  <Form>
    {availableStatistics.map((statistic) => (
      <Form.Check
        key={statistic}
        type="checkbox"
        label={statisticDisplayNames[statistic] || statistic}
        checked={settings.displayStatistics.includes(statistic)}
        onChange={() => handleCheckboxChange(statistic)}
      />
    ))}
  </Form>
  <Button variant="primary" onClick={handleSaveSettings}>
    Guardar Configuración
  </Button>
</Tab.Pane>
                <Tab.Pane eventKey="ModoInv">
  <h2>Ajustes de modo de Invitado</h2>
  <p>El modo de invitado está pensado para habilitarse de forma temporal.</p>
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
  {settings.enableGuestMode && (
    <div>
      <h4>Seleccione un perfil de invitado:</h4>
      <Form.Group controlId="guestProfileSelect">
  <Form.Control as="select" value={selectedGuestProfile} onChange={handleProfileChange}>
    <option value="">Seleccionar perfil</option>
    {guestProfiles.map((profile) => (
      <option key={profile._id} value={profile._id}>{profile.name}</option>
    ))}
  </Form.Control>
</Form.Group>
      
      {/* Link to manage guest profiles */}
      <div className="mt-3">
        <Link to="/configinvitados">
          <Button variant="primary">Administrar Perfiles de Invitado</Button>
        </Link>
      </div>
    </div>
  )}
</Tab.Pane>
<Tab.Pane eventKey="AccSett">
  <h2>Cuenta</h2>
  <h2>Excluye Contactos de las notificaciones</h2>
  
  <Table striped bordered hover>
    <thead>
      <tr>
        <th>Alias</th>
        <th>Número de teléfono</th>
        <th>Excluir?</th>
      </tr>
    </thead>
    <tbody>
      {contacts.map((contact) => (
        <tr key={contact._id}>
          <td>{contact.alias}</td>
          <td>{contact.number}</td>
          <td>
            <Form.Check
              type="checkbox"
              checked={excludedContacts.includes(contact._id)}
              onChange={() => handleExcludeContact(contact._id)}
            />
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
  
  <Button onClick={saveExcludedContacts} disabled={isLoading}>
    {isLoading ? 'Guardando...' : 'Guarda tus cambios'}
  </Button>
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

