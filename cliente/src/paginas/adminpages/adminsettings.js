import React, { useEffect, useState } from 'react';
import { Container, Nav, Navbar, Form, Button, Card, Alert,Dropdown } from 'react-bootstrap';
import axios from 'axios';
import { FaUserCircle } from 'react-icons/fa';

const AdminSettings = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [blockNotifications, setBlockNotifications] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

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
      const fetchSettings = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/settings`);
          setBlockNotifications(response.data.blockNotifications);
          setMaintenanceMode(response.data.maintenanceMode);
        } catch (error) {
          console.error('Error fetching settings:', error);
        }
      };
  
      fetchSettings();
    }, []);

    const handleSaveSettings = async () => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/admin/settings`, {
          blockNotifications,
          maintenanceMode,
        });
        setStatusMessage({ type: 'success', text: 'Ajustes guardados!' });
        console.log(response);
      } catch (error) {
        console.error('Error saving settings:', error);
        setStatusMessage({ type: 'danger', text: 'Error al guardar ajustes. Intentelo nuevamente.' });
      }
    };

  const handleUpdateStatistics = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/statistics/update`);      
      setStatusMessage({ type: 'success', text: 'Estadisticas actualizdas exitosamente!' });
      console.log(response);
    } catch (error) {
      console.error('Error actualizando estadisticas:', error);
      setStatusMessage({ type: 'danger', text: 'Error al actualizar las estadisticas. Intentelo nuevamente.' });
    }
  };

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

        <h2 className="mt-5">Configuraciones para administradores</h2>

        {statusMessage && (
          <Alert variant={statusMessage.type} onClose={() => setStatusMessage(null)} dismissible>
            {statusMessage.text}
          </Alert>
        )}

        <Card className="mb-3">
          <Card.Body>
            <Card.Title>Control de Notificaciones</Card.Title>
            <Form.Check
              type="switch"
              label="Bloquear notificaciones para todos"
              checked={blockNotifications}
              onChange={(e) => setBlockNotifications(e.target.checked)}
            />
          </Card.Body>
        </Card>

        <Card className="mb-3">
          <Card.Body>
            <Card.Title>Modo de Mantenimiento</Card.Title>
            <Form.Check
              type="switch"
              label="Activar modo de mantenimiento"
              checked={maintenanceMode}
              onChange={(e) => setMaintenanceMode(e.target.checked)}
            />
            <Form.Text muted>
              Cuando el modo de mantenimiento está activado, el acceso de los usuarios será restringido temporalmente.
            </Form.Text>
          </Card.Body>
        </Card>

        <Card className="mb-3">
          <Card.Body>
            <Card.Title>Estadísticas del Sistema</Card.Title>
            <Button variant="primary" onClick={handleUpdateStatistics}>
              Actualizar estadísticas manualmente
            </Button>
          </Card.Body>
        </Card>

        <Button variant="success" onClick={handleSaveSettings}>
          Guardar Configuraciones
        </Button>
      </Container>
    </div>
  );
};

export default AdminSettings;
