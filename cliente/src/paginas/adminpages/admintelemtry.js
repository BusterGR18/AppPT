//V1.4

/*
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
*/
//V1.5
import React, { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { Container, Nav, Navbar, Table, Button, Dropdown, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';

const AdminTelemetry = () => {
  const [users, setUsers] = useState([]);
  const [boards, setBoards] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedBoardMap, setSelectedBoardMap] = useState({});
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

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
        setIsLoading(true);
        const usersResponse = await axios.get('http://localhost:4000/api/adminuser/clients');
        setUsers(usersResponse.data);
        setFilteredUsers(usersResponse.data);

        const boardPromises = usersResponse.data.map(user =>
          axios.get(`http://localhost:4000/api/telemetry/boardIDs/${user.email}`)
        );
        const boardResponses = await Promise.all(boardPromises);

        const allBoards = boardResponses.map(response => ({
          userEmail: response.config.url.split('/').pop(),
          boardIDs: response.data,
        }));
        setBoards(allBoards);
        setError('');
      } catch (err) {
        console.error('Error fetching users and board IDs:', err);
        setError('Error al cargar los usuarios o módulos. Por favor, inténtalo de nuevo.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsersAndBoards();
  }, []);

  const handleBoardSelect = (userEmail, boardID) => {
    setSelectedBoardMap(prevMap => ({
      ...prevMap,
      [userEmail]: boardID,
    }));
    setSelectedUser(users.find(user => user.email === userEmail));
  };

  const handleShowDetails = () => {
    setShowDetailsModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedUser(null);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = users.filter(
      user =>
        user.name.toLowerCase().includes(term.toLowerCase()) ||
        user.email.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  if (isLoading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div>
      <Container className="mt-5">
        <Navbar className={isDarkMode ? 'navbar-dark-mode' : 'navbar-light'} expand="lg" fixed="top">
          <Container className="navbar-container">
            <Navbar.Brand href="/">SiNoMoto</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ml-auto">
                <Nav.Link href="/admindash">Vista general</Nav.Link>
                <Nav.Link href="/adminusers">Usuarios</Nav.Link>
                <Nav.Link href="/admintelemetry">Telemetria general</Nav.Link>
                <Nav.Link href="/adminsettings">Configuración</Nav.Link>
                <Dropdown className="profile-dropdown" align="end">
                  <Dropdown.Toggle variant="link" id="profile-dropdown">
                    <FaUserCircle size={24} />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => localStorage.removeItem('token') && (window.location.href = '/login')}>
                      Cerrar Sesión
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Form className="mb-3">
          <Form.Control
            type="text"
            placeholder="Buscar usuario..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </Form>

        <Table striped bordered hover responsive variant={isDarkMode ? 'dark' : 'light'}>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Correo</th>
              <th>Módulos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => {
              const userBoards = boards.find(b => b.userEmail === user.email)?.boardIDs || [];
              const selectedBoardID = selectedBoardMap[user.email];
              return (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    {userBoards.length > 0 ? (
                      <Dropdown>
                        <Dropdown.Toggle variant="info">
                          {selectedBoardID ? selectedBoardID : 'Seleccionar módulo'}
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
                    ) : (
                      'Sin módulos'
                    )}
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
          <Modal.Title>Detalles del módulo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && selectedBoardMap[selectedUser.email] && (
            <div>
              <p><strong>Usuario:</strong> {selectedUser.name}</p>
              <p><strong>Correo:</strong> {selectedUser.email}</p>
              <p><strong>Módulo seleccionado:</strong> {selectedBoardMap[selectedUser.email]}</p>
              {/* Visualize telemetry data */}
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
