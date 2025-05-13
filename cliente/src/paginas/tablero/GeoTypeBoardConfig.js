import React, { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { Navbar, Container, Nav, NavDropdown, Dropdown, Table, Button, Modal, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const GeoTypeBoardConfig = () => {
  const [boards, setBoards] = useState([]);
  const [geoTypes, setGeoTypes] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [assignedGeoTypes, setAssignedGeoTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
        //console.log(decodedToken);
        return decodedToken.id; // Use `id` for ObjectId reference
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    };

    const fetchUserEmailFromToken = () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            console.error('Auth token not found');
            return null;
          }
          const decodedToken = jwtDecode(token);
          //console.log(decodedToken);
          return decodedToken.email; // Use `id` for ObjectId reference
        } catch (error) {
          console.error('Error decoding token:', error);
          return null;
        }
      };
  // Fetch boards and geoTypes on load
  useEffect(() => {
    const fetchBoardsAndGeoTypes = async () => {
      setIsLoading(true);
      try {
        const userId = fetchUserIdFromToken(); // Get userId
        const useremail = fetchUserEmailFromToken();
      if (!userId) {
        console.error('User ID not available');
        return;
      }
        const boardsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/boards/${userId}`); // Replace with your boards API
        const geoTypesResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/geojson/?useremail=${useremail}`); // Replace with your geoTypes API
        setBoards(boardsResponse.data.boards);
        setGeoTypes(geoTypesResponse.data);
      } catch (error) {
        console.error('Error fetching boards and geoTypes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBoardsAndGeoTypes();
  }, []);

  // Handle assigning a GeoType to a board
  const handleAssignGeoType = async (geoTypeId) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/boards/assignGeoType`, {
        boardId: selectedBoard._id,
        geoTypeId,
      });
      setAssignedGeoTypes((prev) => [...prev, geoTypeId]);
    } catch (error) {
      console.error('Error assigning GeoType:', error);
    }
  };

  // Handle removing a GeoType from a board
  const handleRemoveGeoType = async (geoTypeId) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/boards/removeGeoType`, {
        boardId: selectedBoard._id,
        geoTypeId,
      });
      setAssignedGeoTypes((prev) => prev.filter((id) => id !== geoTypeId));
    } catch (error) {
      console.error('Error removing GeoType:', error);
    }
  };

  //Add and remove all
  const handleAssignAllGeoTypes = async (boardId) => {
    try {
      const geoTypeIds = geoTypes.map((geoType) => geoType._id);
      await axios.post(`${process.env.REACT_APP_API_URL}/api/boards/assignGeoType`, {
        boardId,
        geoTypeIds, // Send all GeoType IDs
      });
      if (selectedBoard?._id === boardId) {
        setAssignedGeoTypes(geoTypeIds); // Update state if the modal is open
      }
      alert('Todos los GeoTypes han sido asignados exitosamente.');
    } catch (error) {
      console.error('Error assigning all GeoTypes:', error);
      alert('Ocurrió un error al asignar todos los GeoTypes.');
    }
  };
  
  const handleRemoveAllGeoTypes = async (boardId) => {
    try {
      const geoTypeIds = geoTypes.map((geoType) => geoType._id);
      await axios.post(`${process.env.REACT_APP_API_URL}/api/boards/removeGeoType`, {
        boardId,
        geoTypeIds, // Send an array now
      });
      if (selectedBoard?._id === boardId) {
        setAssignedGeoTypes([]); // Clear state
      }
      alert('Todos los GeoTypes han sido removidos exitosamente.');
    } catch (error) {
      console.error('Error removing all GeoTypes:', error);
      alert('Ocurrió un error al remover todos los GeoTypes.');
    }
  };
  
  

  // Open modal to configure GeoTypes for a specific board
  const handleShowModal = async (board) => {
    setSelectedBoard(board);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/boards/${board._id}/geoTypes`);
      setAssignedGeoTypes(response.data.map((geoType) => geoType._id));
    } catch (error) {
      console.error('Error fetching assigned GeoTypes:', error);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBoard(null);
    setAssignedGeoTypes([]);
  };

  return (
    <div style={{ paddingTop: '64px' }}>
    <Navbar
      expand="lg"
      fixed="top"
      className={`w-100 mb-3 ${isDarkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-light'}`}
      style={{ padding: 0 }}
    >
      <Container fluid className="px-3 d-flex justify-content-between align-items-center">
        <Navbar.Brand href="/" className="fw-bold fs-4 m-0">SiNoMoto</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse
          id="basic-navbar-nav"
          className={isDarkMode ? 'bg-dark text-light' : 'bg-light text-dark'}
        >
          <Nav className="ms-auto align-items-center text-center text-lg-start">
            <Nav.Link href="/dash">Inicio</Nav.Link>
            <Nav.Link href="/contactos">Contactos</Nav.Link>
    
            <NavDropdown title="Rutas" id="basic-nav-dropdown">
              <NavDropdown.Item href="/registerruta">Registrar Nueva Ruta</NavDropdown.Item>
              <NavDropdown.Item href="/viewrutas">Visualizar Rutas Existentes</NavDropdown.Item>
              <NavDropdown.Item href="/deleterutas">Eliminar Rutas</NavDropdown.Item>
            </NavDropdown>
    
            <Nav.Link href="/estadisticas">Estadísticas</Nav.Link>
            <Nav.Link href="/configuracion">Configuración</Nav.Link>
    
            <Dropdown align="end">
              <Dropdown.Toggle variant="link" id="profile-dropdown" className="d-flex align-items-center px-2">
                <FaUserCircle size={24} color={isDarkMode ? "#fff" : "#000"} />
              </Dropdown.Toggle>
    
              <Dropdown.Menu
                align="end"
                className={isDarkMode ? 'bg-dark text-light' : 'bg-light text-dark'}
              >
                <Dropdown.Item onClick={handleLogout}>Cerrar Sesión</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>


      <Container className="mt-5">
      <h2>Configurar Geo-cercos para Modulos</h2>
      {isLoading ? (
        <p>Cargando datos...</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Tablero</th>
              <th>Modo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
  {boards.map((board) => (
    <tr key={board._id}>
      <td>{board.name}</td>
      <td>{board.mode}</td>
      <td>
        <Button variant="info" onClick={() => handleShowModal(board)}>
          Configurar GeoTypes
        </Button>{' '}
        <Button
          variant="success"
          onClick={() => handleAssignAllGeoTypes(board._id)}
        >
          Asignar Todos
        </Button>{' '}
        <Button
          variant="danger"
          onClick={() => handleRemoveAllGeoTypes(board._id)}
        >
          Remover Todos
        </Button>
      </td>
    </tr>
  ))}
</tbody>

        </Table>
      )}

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Configurar Geocercos para {selectedBoard?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Geocercos disponibles</h5>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
  {geoTypes.map((geoType, index) => (
    <tr key={geoType._id}>
      <td>{`Polígono ${index + 1}`}</td>
      <td>
        {assignedGeoTypes.includes(geoType._id) ? (
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleRemoveGeoType(geoType._id)}
          >
            Remover
          </Button>
        ) : (
          <Button
            variant="success"
            size="sm"
            onClick={() => handleAssignGeoType(geoType._id)}
          >
            Asignar
          </Button>
        )}
      </td>
    </tr>
  ))}
</tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>

    </div>
    
  );
};

export default GeoTypeBoardConfig;
