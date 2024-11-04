//V1
/**
import React, { useEffect, useState } from 'react';
import { Container, Nav, Navbar, NavDropdown, Dropdown, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSadTear, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { FaUserCircle } from 'react-icons/fa';

const Estadisticas = () => {
  const [settings, setSettings] = useState({ enableStatistics: false, enableGuestMode: false });
  const [userEmail, setUserEmail] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

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
      const fetchSettings = async () => {
        try {
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
        {settings.enableGuestMode ? (
          <Alert variant="warning" className="text-center">
            <FontAwesomeIcon icon={faExclamationTriangle} size="2x" className="mb-2" />
            <h4>Modo de invitado activado</h4>
            <p>⚠ Esta funcionalidad está restringida cuando habilitas el modo de invitado ⚠</p>
          </Alert>
        ) : settings.enableStatistics ? (
          <div>
            <h1>Tus Estadísticas</h1>
            {/* Render statistics data here 
          </div>
        ) : (
          <div>
            <h1>Advertencia: No tienes tus estadísticas habilitadas</h1>
            <FontAwesomeIcon icon={faSadTear} size="4x" className="text-warning mt-3" />
            <p className="mt-3">Si deseas habilitarlas, haz clic <Link to="/configuracion">aquí</Link>.</p>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Estadisticas;
*/
//V2
/*
import React, { useEffect, useState } from 'react';
import { Container, Nav, Navbar, NavDropdown, Dropdown, Alert, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSadTear, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { FaUserCircle } from 'react-icons/fa';

const Estadisticas = () => {
  const [settings, setSettings] = useState({ enableStatistics: false, enableGuestMode: false, displayStatistics: [] });
  const [userEmail, setUserEmail] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [statisticsData, setStatisticsData] = useState({});

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  // Fetch user statistics
  const fetchStatisticsData = async () => {
    try {
      
      const response = await axios.get(`http://localhost:4000/api/statistics/user?useremail=${userEmail}`);
      setStatisticsData(response.data);
    } catch (error) {
      console.error("Error fetching statistics data:", error);
    }
  };

  // Initial token decoding and settings retrieval
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
    } else {
      const decodedToken = jwtDecode(token);
      setUserEmail(decodedToken.email);
    }
  }, []);

  // Fetch user settings and available statistics when userEmail changes
  useEffect(() => {
    if (userEmail) {
      const fetchSettings = async () => {
        try {
          const response = await axios.get(`http://localhost:4000/api/settings/?useremail=${userEmail}`);
          setSettings(response.data);
          if (response.data.enableStatistics) fetchStatisticsData();
        } catch (error) {
          console.error('Error fetching settings:', error);
        }
      };
      fetchSettings();
    }
  }, [userEmail]);

  useEffect(() => {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(prefersDarkScheme.matches);
    const handleDarkModeChange = (e) => setIsDarkMode(e.matches);
    prefersDarkScheme.addEventListener('change', handleDarkModeChange);
    return () => prefersDarkScheme.removeEventListener('change', handleDarkModeChange);
  }, []);

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
        {settings.enableGuestMode ? (
          <Alert variant="warning" className="text-center">
            <FontAwesomeIcon icon={faExclamationTriangle} size="2x" className="mb-2" />
            <h4>Modo de invitado activado</h4>
            <p>⚠ Esta funcionalidad está restringida cuando habilitas el modo de invitado ⚠</p>
          </Alert>
        ) : settings.enableStatistics ? (
          <div>
            <h1>Tus Estadísticas</h1>
            <Table striped bordered hover responsive variant={isDarkMode ? 'dark' : 'light'}>
              <thead>
                <tr>
                  <th>Estadística</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                {settings.displayStatistics.map((stat) => (
                  <tr key={stat}>
                    <td>{stat}</td>
                    <td>{statisticsData[stat]}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ) : (
          <div>
            <h1>Advertencia: No tienes tus estadísticas habilitadas</h1>
            <FontAwesomeIcon icon={faSadTear} size="4x" className="text-warning mt-3" />
            <p className="mt-3">Si deseas habilitarlas, haz clic <Link to="/configuracion">aquí</Link>.</p>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Estadisticas;*/
//V3
import React, { useEffect, useState } from 'react';
import { Container, Nav, Navbar, NavDropdown, Dropdown, Alert, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSadTear, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { FaUserCircle } from 'react-icons/fa';

const Estadisticas = () => {
  const [settings, setSettings] = useState({ enableStatistics: false, enableGuestMode: false, displayStatistics: [] });
  const [userEmail, setUserEmail] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [statisticsData, setStatisticsData] = useState(null); // Update initial state to null

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  // Fetch user statistics
  const fetchStatisticsData = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/statistics/user?useremail=${userEmail}`);
      setStatisticsData(response.data);
    } catch (error) {
      console.error("Error fetching statistics data:", error);
    }
  };

  // Initial token decoding and settings retrieval
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
    } else {
      const decodedToken = jwtDecode(token);
      setUserEmail(decodedToken.email);
    }
  }, []);

  // Fetch user settings and available statistics when userEmail changes
  useEffect(() => {
    if (userEmail) {
      const fetchSettings = async () => {
        try {
          const response = await axios.get(`http://localhost:4000/api/settings/?useremail=${userEmail}`);
          setSettings(response.data);
          if (response.data.enableStatistics) fetchStatisticsData();
        } catch (error) {
          console.error('Error fetching settings:', error);
        }
      };
      fetchSettings();
    }
  }, [userEmail]);

  useEffect(() => {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(prefersDarkScheme.matches);
    const handleDarkModeChange = (e) => setIsDarkMode(e.matches);
    prefersDarkScheme.addEventListener('change', handleDarkModeChange);
    return () => prefersDarkScheme.removeEventListener('change', handleDarkModeChange);
  }, []);

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
        {settings.enableGuestMode ? (
          <Alert variant="warning" className="text-center">
            <FontAwesomeIcon icon={faExclamationTriangle} size="2x" className="mb-2" />
            <h4>Modo de invitado activado</h4>
            <p>⚠ Esta funcionalidad está restringida cuando habilitas el modo de invitado ⚠</p>
          </Alert>
        ) : settings.enableStatistics ? (
          <div>
            <h1>Tus Estadísticas</h1>
            {statisticsData?.boards ? (
              statisticsData.boards.map((board, index) => (
                <div key={board.boardid} className="mb-4">
                  <h3>Board ID: {board.boardid}</h3>
                  <Table striped bordered hover responsive variant={isDarkMode ? 'dark' : 'light'}>
                    <thead>
                      <tr>
                        <th>Estadística</th>
                        <th>Valor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {settings.displayStatistics.includes('distanceTraveled') && (
                        <tr>
                          <td>Distancia Recorrida</td>
                          <td>{board.distanceTraveled} km</td>
                        </tr>
                      )}
                      {settings.displayStatistics.includes('averageSpeed') && (
                        <tr>
                          <td>Velocidad Promedio</td>
                          <td>{board.averageSpeed} km/h</td>
                        </tr>
                      )}
                      {settings.displayStatistics.includes('maxSpeed') && (
                        <tr>
                          <td>Velocidad Máxima</td>
                          <td>{board.maxSpeed} km/h</td>
                        </tr>
                      )}
                      {settings.displayStatistics.includes('totalRideDuration') && (
                        <tr>
                          <td>Duración Total del Viaje</td>
                          <td>{board.totalRideDuration} horas</td>
                        </tr>
                      )}
                      {settings.displayStatistics.includes('accidentCount') && (
                        <tr>
                          <td>Conteo de Accidentes</td>
                          <td>{board.accidentCount}</td>
                        </tr>
                      )}
                      {settings.displayStatistics.includes('guestModeStats') && board.guestModeStats && (
                        <>
                          <tr>
                            <td>Modo Invitado - Frecuencia</td>
                            <td>{board.guestModeStats.frequency}</td>
                          </tr>
                          <tr>
                            <td>Modo Invitado - Duración Total</td>
                            <td>{board.guestModeStats.totalDuration} horas</td>
                          </tr>
                        </>
                      )}
                      {settings.displayStatistics.includes('topLocations') && board.topLocations && board.topLocations.length > 0 && (
                        <tr>
                          <td>Top Ubicaciones</td>
                          <td>
                            {board.topLocations.map((location, idx) => (
                              <div key={idx}>
                                Lat: {location.latitude}, Lon: {location.longitude} - Visitas: {location.visitCount}
                              </div>
                            ))}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>
              ))
            ) : (
              <p>No hay datos estadísticos disponibles.</p>
            )}
          </div>
        ) : (
          <div>
            <h1>Advertencia: No tienes tus estadísticas habilitadas</h1>
            <FontAwesomeIcon icon={faSadTear} size="4x" className="text-warning mt-3" />
            <p className="mt-3">Si deseas habilitarlas, haz clic <Link to="/configuracion">aquí</Link>.</p>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Estadisticas;
