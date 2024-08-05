/*import React, { useEffect } from 'react';
import { Container, Nav, Button, Navbar, NavDropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSadTear } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
const Estadisticas = () => {
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

      <Container className="mt-5 text-center">
        <h1>Advertencia: No tienes tus estadísticas habilitadas</h1>
        <FontAwesomeIcon icon={faSadTear} size="4x" className="text-warning mt-3" />
        <p className="mt-3">Si deseas habilitarlas, haz clic <Link to="/configuracion">aquí</Link>.</p>
      </Container>

      <footer className="fixed-bottom text-center py-2 bg-light">
      <Button variant="outline-secondary" onClick={handleLogout}>
        Cerrar Sesión
      </Button>
      </footer>
    </div>
  );

};
export default Estadisticas;

*/
/*
//V1.1
import React, { useEffect, useState } from 'react';
import { Container, Nav, Button, Navbar, NavDropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSadTear } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const Estadisticas = () => {
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
    } else {
      document.body.classList.remove('dark-mode');
    }

    prefersDarkScheme.addEventListener('change', (e) => {
      if (e.matches) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    });

    return () => {
      prefersDarkScheme.removeEventListener('change', () => {});
    };
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

      <Container className="mt-5 text-center">
        {settings.enableStatistics ? (
          <div>
            <h1>Tus Estadísticas</h1>
            
          </div>
        ) : (
          <div>
            <h1>Advertencia: No tienes tus estadísticas habilitadas</h1>
            <FontAwesomeIcon icon={faSadTear} size="4x" className="text-warning mt-3" />
            <p className="mt-3">Si deseas habilitarlas, haz clic <Link to="/configuracion">aquí</Link>.</p>
          </div>
        )}
      </Container>

      <footer className="fixed-bottom text-center py-2 bg-light">
        <Button variant="outline-secondary" onClick={handleLogout}>
          Cerrar Sesión
        </Button>
      </footer>
    </div>
  );
};

export default Estadisticas;
*/

//Dark mode test
/*
import React, { useEffect, useState } from 'react';
import { Container, Nav, Button, Navbar, NavDropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSadTear } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const Estadisticas = () => {
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
    } else {
      document.body.classList.remove('dark-mode');
    }

    prefersDarkScheme.addEventListener('change', (e) => {
      if (e.matches) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    });

    return () => {
      prefersDarkScheme.removeEventListener('change', () => {});
    };
  }, []);

  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
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
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>

      <Container className={`mt-5 ${document.body.classList.contains('dark-mode') ? 'container-dark' : 'container'}`}>
        {settings.enableStatistics ? (
          <div>
            <h1>Tus Estadísticas</h1>
          </div>
        ) : (
          <div>
            <h1>Advertencia: No tienes tus estadísticas habilitadas</h1>
            <FontAwesomeIcon icon={faSadTear} size="4x" className="text-warning mt-3" />
            <p className="mt-3">Si deseas habilitarlas, haz clic <Link to="/configuracion">aquí</Link>.</p>
          </div>
        )}
      </Container>

      <footer className={`fixed-bottom text-center py-2 footer-${document.body.classList.contains('dark-mode') ? 'dark' : 'light'}`}>
        <Button variant="outline-secondary" onClick={handleLogout}>
          Cerrar Sesión
        </Button>
      </footer>
    </div>
  );
};

export default Estadisticas;
*/
//Dark mode V2
import React, { useEffect, useState } from 'react';
import { Container, Nav, Navbar, NavDropdown, Dropdown} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSadTear } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { FaUserCircle } from 'react-icons/fa'; 


const Estadisticas = () => {
  const [settings, setSettings] = useState({ enableStatistics: false });
  const [userEmail, setUserEmail] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

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

      <Container className={`mt-5 ${document.body.classList.contains('dark-mode') ? 'container-dark' : 'container'}`}>
        {settings.enableStatistics ? (
          <div>
            <h1>Tus Estadísticas</h1>
            {/* Render statistics data here */}
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
