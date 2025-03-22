import React, { useEffect, useState } from 'react';
import { Container, Navbar, Nav, NavDropdown, Dropdown, Table, Button, Form, Modal } from 'react-bootstrap';
import { MapContainer, TileLayer, Polygon, useMap } from 'react-leaflet';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { FaUserCircle } from 'react-icons/fa';
import L from 'leaflet';
import 'leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

const Invitados = () => {
  const [guestProfiles, setGuestProfiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactData, setContactData] = useState({ name: '', phoneNumber: '' });
  const [editContactIndex, setEditContactIndex] = useState(null);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [profileData, setProfileData] = useState({ name: '', email: '', phoneNumber: '', contacts: [], locationPolygon: null });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [boardIDs, setBoardIDs] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };


  const fetchBoardIDs = async () => {
    try {
      const token = localStorage.getItem('token');
      const decodedToken = jwtDecode(token);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/capi/telemetry/boardIDs/${decodedToken.email}`);
      setBoardIDs(response.data);
    } catch (error) {
      console.error('Error fetching board IDs:', error);
    }
  };

  const fetchGuestProfiles = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/guest-profiles`);
      setGuestProfiles(response.data);
    } catch (error) {
      console.error('Error fetching guest profiles:', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
    } else {
      jwtDecode(token);
    }
    fetchBoardIDs();
    fetchGuestProfiles();
  }, []);

  const handleShowModal = (profile = null) => {
    if (profile) {
      setProfileData({
        ...profile,
        contacts: profile.contacts || []
      });
      setIsEditing(true);
    } else {
      setProfileData({ name: '', email: '', phoneNumber: '', contacts: [], locationPolygon: null });
      setIsEditing(false);
    }
    setShowModal(true);
  };

  const handleSaveProfile = async () => {
    console.log("Profile data being saved:", profileData); // Log profile data
    
    try {
      const profilePayload = {
        ...profileData,
        boardID: profileData.boardID || null // Ensuring boardID is passed, even if empty
      };
  
      if (isEditing) {
        await axios.put(`${process.env.REACT_APP_API_URL}/api/guest-profiles/${profileData._id}`, profilePayload);
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/guest-profiles`, profilePayload);
      }
      fetchGuestProfiles();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleDeleteProfile = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/guest-profiles/${id}`);
      fetchGuestProfiles();
    } catch (error) {
      console.error('Error deleting profile:', error);
    }
  };

  const handleShowContactModal = (contact = null, index = null) => {
    if (contact) {
      setContactData(contact);
      setIsEditingContact(true);
      setEditContactIndex(index);
    } else {
      setContactData({ name: '', phoneNumber: '' });
      setIsEditingContact(false);
      setEditContactIndex(null);
    }
    setShowContactModal(true);
  };

  const handleCloseContactModal = () => {
    setShowContactModal(false);
    setContactData({ name: '', phoneNumber: '' });
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSaveContact = () => {
    const updatedContacts = [...profileData.contacts];
    if (isEditingContact && editContactIndex !== null) {
      updatedContacts[editContactIndex] = contactData;
    } else {
      updatedContacts.push(contactData);
    }
    setProfileData((prevData) => ({ ...prevData, contacts: updatedContacts }));
    handleCloseContactModal();
  };

  const handleDeleteContact = (index) => {
    const updatedContacts = profileData.contacts.filter((_, i) => i !== index);
    setProfileData((prevData) => ({ ...prevData, contacts: updatedContacts }));
  };

  const handlePolygonCreated = (e) => {
    const layer = e.layer;
    const geojson = layer.toGeoJSON();
    setProfileData((prevData) => ({
      ...prevData,
      locationPolygon: {
        type: "Polygon",
        coordinates: geojson.geometry.coordinates
      }
    }));
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setProfileData({ name: '', email: '', phoneNumber: '', contacts: [], locationPolygon: null });
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
        <h2>Administra los perfiles del modo invitado</h2>
        <Button variant="primary" className="mb-3" onClick={() => handleShowModal()}>Añade un nuevo perfil</Button>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo electronico</th>
              <th>Numero Telefonico</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody>
            {guestProfiles.map((profile) => (
              <tr key={profile._id}>
                <td>{profile.name}</td>
                <td>{profile.email}</td>
                <td>{profile.phoneNumber}</td>
                <td>
                  <Button variant="info" size="sm" onClick={() => handleShowModal(profile)}>Editar</Button>{' '}
                  <Button variant="danger" size="sm" onClick={() => handleDeleteProfile(profile._id)}>Eliminar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Modal for adding/editing profiles */}
        <Modal show={showModal} onHide={handleCloseModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{isEditing ? 'Edita el Perfil del invitado' : 'Añade un nuevo Perfil de invitado'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formName">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formEmail">
                <Form.Label>Correo electronico</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="formPhoneNumber">
                <Form.Label>Numero telefonico</Form.Label>
                <Form.Control
                  type="text"
                  name="phoneNumber"
                  value={profileData.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              {/* Board ID Selection */}
      <Form.Group controlId="formBoardID">
        <Form.Label>Assign Board ID</Form.Label>
        <Form.Control
          as="select"
          name="boardID"
          value={profileData.boardID || ''}
          onChange={(e) => setProfileData({ ...profileData, boardID: e.target.value })}
        >
          <option value="">Select Board ID</option>
          {boardIDs.map((id) => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </Form.Control>
      </Form.Group>

              {/* Contacts Section */}
              <h5>Contactos</h5>
              <Table striped bordered>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Numero telefonico</th>
                    <th>Opciones</th>
                  </tr>
                </thead>
                <tbody>
                  {profileData.contacts.map((contact, index) => (
                    <tr key={index}>
                      <td>{contact.name}</td>
                      <td>{contact.phoneNumber}</td>
                      <td>
                        <Button variant="info" size="sm" onClick={() => handleShowContactModal(contact, index)}>Editar</Button>{' '}
                        <Button variant="danger" size="sm" onClick={() => handleDeleteContact(index)}>Eliminar</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Button variant="secondary" onClick={() => handleShowContactModal()}>Añadir Contacto</Button>

              {/* Map for drawing the polygon */}
              <h5>Define el Poligono de ubicacion</h5>
              <MapContainer center={[0, 0]} zoom={2} style={{ height: '400px', width: '100%' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {profileData.locationPolygon && profileData.locationPolygon.coordinates && (
                  <Polygon positions={profileData.locationPolygon.coordinates} />
                )}
                <DrawControl onCreated={handlePolygonCreated} />
              </MapContainer>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>Cerrar</Button>
            <Button variant="primary" onClick={handleSaveProfile}>
              {isEditing ? 'Actualizar Perfil' : 'Guardar Perfil'}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal for adding/editing contacts */}
        <Modal show={showContactModal} onHide={handleCloseContactModal}>
          <Modal.Header closeButton>
            <Modal.Title>{isEditingContact ? 'Editar Contacto' : 'Añadir Contacto'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="contactName">
                <Form.Label>Nombre del Contacto</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={contactData.name}
                  onChange={handleContactChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="contactPhoneNumber">
                <Form.Label>Numero telefonico del contacto</Form.Label>
                <Form.Control
                  type="text"
                  name="phoneNumber"
                  value={contactData.phoneNumber}
                  onChange={handleContactChange}
                  required
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseContactModal}>Cerrar</Button>
            <Button variant="primary" onClick={handleSaveContact}>
              {isEditingContact ? 'Actualizar Contacto' : 'Añadir Contacto'}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

// Drawing control for creating polygons
const DrawControl = ({ onCreated }) => {
  const map = useMap();

  useEffect(() => {
    const drawControl = new L.Control.Draw({
      position: 'topright',
      draw: {
        marker: false,
        circlemarker: false,
        circle: false,
        polyline: false,
        rectangle: false,
        polygon: {
          allowIntersection: false,
          showArea: true,
        },
      },
      edit: {
        featureGroup: new L.FeatureGroup(),
      },
    });

    map.addControl(drawControl);
    map.on('draw:created', onCreated);

    return () => {
      map.off('draw:created', onCreated);
      map.removeControl(drawControl);
    };
  }, [map, onCreated]);

  return null;
};

export default Invitados;
