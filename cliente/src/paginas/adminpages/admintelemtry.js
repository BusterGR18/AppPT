//Base page
/*
import React, { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa'; 
import { Container, Nav, Navbar, Dropdown, Card} from 'react-bootstrap';
import axios from 'axios';


const AdminTelemetry = () => {
    const [userMetrics, setUserMetrics] = useState([]);
  const [systemLogs, setSystemLogs] = useState([]);
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

      </Container>      
    </div>
  );
};

export default AdminTelemetry;
*/
//V1
/*
import React, { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa'; 
import { Container, Nav, Navbar, Table, Button, Dropdown, Modal } from 'react-bootstrap';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const AdminTelemetry = () => {
  const [clientUsers, setClientUsers] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showTelemetryModal, setShowTelemetryModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    const fetchClientUsers = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/adminuser/clients');
        setClientUsers(response.data);
      } catch (error) {
        console.error('Error fetching client users:', error);
      }
    };

    fetchClientUsers();
  }, []);

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setShowTelemetryModal(true);
  };

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

        <Table striped bordered hover responsive variant={isDarkMode ? 'dark' : 'light'}>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Correo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientUsers.map((user, index) => (
              <tr key={index}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <Button variant="info" onClick={() => handleOpenModal(user)}>Ver Telemetría</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>

      <Modal show={showTelemetryModal} onHide={() => setShowTelemetryModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Telemetría de {selectedUser?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {}
          <p>Última ubicación conocida: [placeholder]</p>
          <p>Estadísticas: [placeholder]</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowTelemetryModal(false)}>Cerrar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminTelemetry;
*/
//V1.2
/*
import React, { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { Container, Nav, Navbar, Table, Button, Dropdown, Modal } from 'react-bootstrap';
import axios from 'axios';

const AdminTelemetry = () => {
  const [users, setUsers] = useState([]);
  const [boards, setBoards] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedBoardID, setSelectedBoardID] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

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
    const fetchUsersAndBoards = async () => {
      try {
        // Fetch all client users
        const usersResponse = await axios.get('http://localhost:4000/api/adminuser/clients');
        setUsers(usersResponse.data);

        // Fetch board IDs for each user
        const boardPromises = usersResponse.data.map(user =>
          axios.get(`http://localhost:4000/api/telemetry/boardIDs/${user.email}`)
        );
        const boardResponses = await Promise.all(boardPromises);

        // Flatten the array of boards and set state
        const allBoards = boardResponses.flatMap(response => ({
          userEmail: response.config.url.split('/').pop(), // Extract user email from URL
          boardIDs: response.data
        }));
        setBoards(allBoards);
      } catch (error) {
        console.error('Error fetching users and board IDs:', error);
      }
    };

    fetchUsersAndBoards();
  }, []);

  const handleShowDetails = (user, boardID) => {
    setSelectedUser(user);
    setSelectedBoardID(boardID);
    setShowDetailsModal(true);
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
                    <Dropdown.Item onClick={() => localStorage.removeItem('token') && (window.location.href = '/login')}>Cerrar Sesión</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>  
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Table striped bordered hover responsive variant={isDarkMode ? 'dark' : 'light'}>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Correo</th>
              <th>Tableros</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => {
              const userBoards = boards.find(b => b.userEmail === user.email)?.boardIDs || [];
              return (
                <React.Fragment key={user._id}>
                  {userBoards.map(boardID => (
                    <tr key={boardID}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{boardID}</td>
                      <td>
                        <Button variant="info" onClick={() => handleShowDetails(user, boardID)}>Ver detalles</Button>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </Table>
      </Container>

      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Detalles del tablero</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Información del tablero</h5>
          {selectedUser && selectedBoardID && (
            <div>
              <p><strong>Usuario:</strong> {selectedUser.name}</p>
              <p><strong>Correo:</strong> {selectedUser.email}</p>
              <p><strong>ID del tablero:</strong> {selectedBoardID}</p>
              {}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>Cerrar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminTelemetry;
*/
//V1.3 
//Dropdown version
/*
import React, { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { Container, Nav, Navbar, Table, Button, Dropdown, Modal, Form } from 'react-bootstrap';
import axios from 'axios';

const AdminTelemetry = () => {
  const [users, setUsers] = useState([]);
  const [boards, setBoards] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedBoardID, setSelectedBoardID] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const fetchUsersAndBoards = async () => {
      try {
        const usersResponse = await axios.get('http://localhost:4000/api/adminuser/clients');
        setUsers(usersResponse.data);

        const boardPromises = usersResponse.data.map(user =>
          axios.get(`http://localhost:4000/api/telemetry/boardIDs/${user.email}`)
        );
        const boardResponses = await Promise.all(boardPromises);

        const allBoards = boardResponses.map(response => ({
          userEmail: response.config.url.split('/').pop(),
          boardIDs: response.data
        }));
        setBoards(allBoards);
      } catch (error) {
        console.error('Error fetching users and board IDs:', error);
      }
    };

    fetchUsersAndBoards();
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

  const handleShowDetails = (user, boardID) => {
    setSelectedUser(user);
    setSelectedBoardID(boardID);
    setShowDetailsModal(true);
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
                    <Dropdown.Item onClick={() => localStorage.removeItem('token') && (window.location.href = '/login')}>Cerrar Sesión</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Table striped bordered hover responsive variant={isDarkMode ? 'dark' : 'light'}>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Correo</th>
              <th>Modulos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => {
              const userBoards = boards.find(b => b.userEmail === user.email)?.boardIDs || [];
              return (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle variant="info">
                        Seleccionar modulo
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {userBoards.map(boardID => (
                          <Dropdown.Item key={boardID} onClick={() => handleShowDetails(user, boardID)}>
                            {boardID}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                  <td>
                    <Button variant="info" onClick={() => handleShowDetails(user, selectedBoardID)}>Ver detalles</Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Container>

      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Detalles del tablero</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Información del tablero</h5>
          {selectedUser && selectedBoardID && (
            <div>
              <p><strong>Usuario:</strong> {selectedUser.name}</p>
              <p><strong>Correo:</strong> {selectedUser.email}</p>
              <p><strong>ID del tablero:</strong> {selectedBoardID}</p>
              {}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>Cerrar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminTelemetry;
*/
//V1.4


import React, { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { Container, Nav, Navbar, Table, Button, Dropdown, Modal, Form } from 'react-bootstrap';
import axios from 'axios';

const AdminTelemetry = () => {
  const [users, setUsers] = useState([]);
  const [boards, setBoards] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedBoardMap, setSelectedBoardMap] = useState({});
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);


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
    const fetchUsersAndBoards = async () => {
      try {
        const usersResponse = await axios.get('http://localhost:4000/api/adminuser/clients');
        setUsers(usersResponse.data);

        const boardPromises = usersResponse.data.map(user =>
          axios.get(`http://localhost:4000/api/telemetry/boardIDs/${user.email}`)
        );
        const boardResponses = await Promise.all(boardPromises);

        const allBoards = boardResponses.map(response => ({
          userEmail: response.config.url.split('/').pop(),
          boardIDs: response.data
        }));
        setBoards(allBoards);
      } catch (error) {
        console.error('Error fetching users and board IDs:', error);
      }
    };

    fetchUsersAndBoards();
  }, []);

  const handleBoardSelect = (userEmail, boardID) => {
    setSelectedBoardMap(prevMap => ({
      ...prevMap,
      [userEmail]: boardID
    }));
    setSelectedUser(users.find(user => user.email === userEmail));
  };

  const handleShowDetails = () => {
    setShowDetailsModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedUser(null);
    setSelectedBoardMap(prevMap => ({ ...prevMap, [selectedUser.email]: null }));
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
                    <Dropdown.Item onClick={() => localStorage.removeItem('token') && (window.location.href = '/login')}>Cerrar Sesión</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Table striped bordered hover responsive variant={isDarkMode ? 'dark' : 'light'}>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Correo</th>
              <th>Modulos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => {
              const userBoards = boards.find(b => b.userEmail === user.email)?.boardIDs || [];
              const selectedBoardID = selectedBoardMap[user.email];
              return (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle variant="info">
                        {selectedBoardID ? selectedBoardID : 'Seleccionar modulo'}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {userBoards.map(boardID => (
                          <Dropdown.Item
                            key={boardID}
                            onClick={() => handleBoardSelect(user.email, boardID)}
                          >
                            {boardID}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                  <td>
                    <Button
                      variant="info"
                      onClick={handleShowDetails}
                      disabled={!selectedBoardID}
                    >
                      Ver detalles
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Container>

      <Modal show={showDetailsModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Detalles del modulo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Información del modulo</h5>
          {selectedUser && selectedBoardMap[selectedUser.email] && (
            <div>
              <p><strong>Registrado al usuario:</strong> {selectedUser.name}</p>
              <p><strong>Correo:</strong> {selectedUser.email}</p>
              <p><strong>ID del modulo:</strong> {selectedBoardMap[selectedUser.email]}</p>
              {/* Add other details or visualizations for the board here */}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Cerrar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminTelemetry;
