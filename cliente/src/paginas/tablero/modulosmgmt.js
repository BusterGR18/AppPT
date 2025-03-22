import React, { useState, useEffect, Link } from 'react';
import { Navbar, Container, Nav, NavDropdown, Dropdown, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import { FaUserCircle } from 'react-icons/fa';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const AdminModulos = ({  handleLogout, settings }) => {
  const [boards, setBoards] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add' or 'edit'
  const [currentBoard, setCurrentBoard] = useState(null);
  const [formData, setFormData] = useState({
    boardId: '',
    name: '',
    mode: 'normal', // 'normal' or 'guest'
  });

  useEffect(() => {
    fetchBoards();
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





  const fetchUserIdFromToken = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Auth token not found');
        return null;
      }
      const decodedToken = jwtDecode(token);
      //console.log(decodedToken.id);
      return decodedToken.id; // Use `id` for ObjectId reference
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };
  


  const fetchBoards = async () => {
    try {
      const userId = fetchUserIdFromToken(); // Get userId
      if (!userId) {
        console.error('User ID not available');
        return;
      }
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/boards/${userId}`);
      setBoards(response.data.boards); // Populate the boards state
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.warn('No boards found for this user.');
        setBoards([]); // Explicitly set boards to an empty array
      } else {
        console.error('Error fetching boards:', error);
      }
    }
  };
  
  
      

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openModal = (type, board = null) => {
    setModalType(type);
    setCurrentBoard(board);
    setFormData(board ? { boardId: board.boardId, name: board.name, mode: board.mode } : { boardId: '', name: '', mode: 'normal' });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      const userId = fetchUserIdFromToken(); // Ensure userId is included
      const data = { ...formData, userId }; // Include userId in the request
  
      if (modalType === 'add') {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/boards/create`, data);
      } else if (modalType === 'edit') {
        await axios.put(`${process.env.REACT_APP_API_URL}/api/boards/update/${currentBoard.boardId}`, formData);
      }
      fetchBoards();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving board:', error);
    }
  };
  

  const handleDelete = async (boardId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/boards/delete/${boardId}`);
      fetchBoards();
    } catch (error) {
      console.error('Error deleting board:', error);
    }
  };

  return (
    <div>
      {/* Navbar */}
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
              <Nav.Link href='/estadisticas'>Estadísticas</Nav.Link>
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

      {/* Board Management */}
      <Container className={`mt-5 ${isDarkMode ? 'container-dark' : 'container'}`}>
        <h1>Gestión de Modulos</h1>

        {settings?.enableGuestMode ? (
          <Alert variant="warning">
            <strong>⚠ Esta funcionalidad está restringida cuando habilitas el modo de invitado ⚠</strong>
          </Alert>
        ) : (
          <>
            <Button onClick={() => openModal('add')} className="mb-3">Agregar Modulo</Button>

            <Table striped bordered hover>
  <thead>
    <tr>
      <th>ID del Modulo</th>
      <th>Alias</th>
      <th>Modo</th>
      <th>Acciones</th>
    </tr>
  </thead>
  <tbody>
    {boards.length === 0 ? (
      <tr>
        <td colSpan="4">
          <Alert variant="info" className="text-center">
            Actualmente no hay módulos registrados. Por favor, agrega uno usando el botón "Agregar Módulo".
          </Alert>
        </td>
      </tr>
    ) : (
      boards.map((board) => (
        <tr key={board.boardId}>
          <td>{board.boardId}</td>
          <td>{board.name}</td>
          <td>{board.mode}</td>
          <td>
            <Button variant="warning" onClick={() => openModal('edit', board)} className="me-2">Editar</Button>
            <Button variant="danger" onClick={() => handleDelete(board.boardId)}>Eliminar</Button>                        
          </td>
        </tr>
      ))
    )}
  </tbody>
</Table>

          </>
        )}

        {/* Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{modalType === 'add' ? 'Agregar Modulo' : 'Editar Modulo'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="boardId" className="mb-3">
                <Form.Label>ID del Modulo</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingresa el ID del Modulo"
                  name="boardId"
                  value={formData.boardId}
                  onChange={handleInputChange}
                  disabled={modalType === 'edit'}
                />
              </Form.Group>
              <Form.Group controlId="name" className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingresa el alias del Modulo"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="mode" className="mb-3">
                <Form.Label>Modo</Form.Label>
                <Form.Select
                  name="mode"
                  value={formData.mode}
                  onChange={handleInputChange}
                >
                  <option value="normal">Normal</option>
                  <option value="guest">Invitado</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cerrar</Button>
            <Button variant="primary" onClick={handleSave}>Guardar Cambios</Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default AdminModulos;
