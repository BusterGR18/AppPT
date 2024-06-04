/*import React from 'react';
import { Container, Row, Col, Nav, Tab, Card, Button, Navbar } from 'react-bootstrap';
const Contactos = () => {
    return(
      <div>
      <Navbar bg="light" expand="lg" fixed="top">
      <Container>
        <Navbar.Brand href="/">SiNoMoto</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link href='/dash'>Inicio</Nav.Link>
            <Nav.Link href='/contactos'>Contactos</Nav.Link>
            <Nav.Link href='/rutas'>Rutas</Nav.Link>
            <Nav.Link href='/estadisticas'>Estadisticas</Nav.Link>
            <Nav.Link href='/configuracion'>Configuración</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>


<footer className="fixed-bottom text-center py-2 bg-light">
<Button variant="outline-secondary" >
  Cerrar Sesión
</Button>
</footer>
</div>

    );

};
export default Contactos;

import React, { useState, useEffect } from 'react';
import { Container, Nav, Navbar, Table, Form, Button } from 'react-bootstrap';

const Contactos = () => {
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
  // State to manage contact information
  const [contactName, setContactName] = useState('');
  const [contacts, setContacts] = useState([
    { id: 1, alias: 'Contacto 1', number: '123-456-7890' },
    { id: 2, alias: 'Contacto 2', number: '987-654-3210' },
    // Add more example contacts as needed
  ]);

  // Function to handle adding a new contact
  const handleAddContact = () => {
    // Perform actions to add the contact (e.g., API call, state update)
    console.log('Adding contact:', contactName);

    // Update the contacts state with the new contact
    setContacts((prevContacts) => [
      ...prevContacts,
      { id: prevContacts.length + 1, alias: contactName, number: 'New Number' },
    ]);

    // Reset the contactName state after adding
    setContactName('');
  };

  // Function to handle editing a contact (placeholder for now)
  const handleEditContact = (id) => {
    console.log('Editing contact with ID:', id);
  };

  // Function to handle deleting a contact (placeholder for now)
  const handleDeleteContact = (id) => {
    console.log('Deleting contact with ID:', id);
    // Update the contacts state after deletion
    setContacts((prevContacts) => prevContacts.filter((contact) => contact.id !== id));
  };

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
              <Nav.Link href='/rutas'>Rutas</Nav.Link>
              <Nav.Link href='/estadisticas'>Estadisticas</Nav.Link>
              <Nav.Link href='/configuracion'>Configuración</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-5">
        <h1>Contactos</h1>
        <h2>Agregar Contacto Nuevo</h2>

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
                <Form.Control type="text" placeholder="Número del Contacto" />
              </td>
              <td>
                <Button variant="primary" onClick={handleAddContact}>
                  Agregar
                </Button>
              </td>
            </tr>
          </tbody>
        </Table>

        <h2>Visualizar Contactos</h2>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Alias del Contacto</th>
              <th>Número del Contacto</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact.id}>
                <td>{contact.id}</td>
                <td>{contact.alias}</td>
                <td>{contact.number}</td>
                <td>
                  <Button variant="info" onClick={() => handleEditContact(contact.id)}>
                    Editar
                  </Button>{' '}
                  <Button variant="danger" onClick={() => handleDeleteContact(contact.id)}>
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
      <footer className="fixed-bottom text-center py-2 bg-light">
      <Button variant="outline-secondary" onClick={handleLogout}>
        Cerrar Sesión
      </Button>
</footer>
    </div>
  );
};

export default Contactos;

//V2
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Nav, Navbar, Table, Form, Button } from 'react-bootstrap';

const Contactos = () => {
  const [contactName, setContactName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    // Check if user is authenticated (e.g., by verifying JWT token)
    const isAuthenticated = localStorage.getItem('token') !== null;

    // If user is not authenticated, redirect to login page
    if (!isAuthenticated) {
      window.location.href = '/login';
    } else {
      fetchContacts();
    }
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/contacts');
      setContacts(response.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const handleAddContact = async () => {
    try {
      const newContact = { alias: contactName, number: contactNumber };
      const response = await axios.post('http://localhost:4000/api/contacts', newContact);
      setContacts([...contacts, response.data]);
      setContactName('');
      setContactNumber('');
    } catch (error) {
      console.error('Error adding contact:', error);
    }
  };

  const handleDeleteContact = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/contacts/${id}`);
      setContacts(contacts.filter((contact) => contact.id !== id));
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const handleEditContact = async (id) => {
    // Placeholder for edit functionality
    console.log('Editing contact with ID:', id);
  };

  const handleLogout = () => {
    // Matar token JWT del almacenamiento
    localStorage.removeItem('token');
    // Redireccion al login    
    window.location.href = '/login';
  };

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
              <Nav.Link href='/rutas'>Rutas</Nav.Link>
              <Nav.Link href='/estadisticas'>Estadisticas</Nav.Link>
              <Nav.Link href='/configuracion'>Configuración</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-5">
        <h1>Contactos</h1>
        <h2>Agregar Contacto Nuevo</h2>

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
                <Button variant="primary" onClick={handleAddContact}>
                  Agregar
                </Button>
              </td>
            </tr>
          </tbody>
        </Table>

        <h2>Visualizar Contactos</h2>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Alias del Contacto</th>
              <th>Número del Contacto</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact._id}>
                <td>{contact._id}</td>
                <td>{contact.alias}</td>
                <td>{contact.number}</td>
                <td>
                  <Button variant="info" onClick={() => handleEditContact(contact._id)}>
                    Editar
                  </Button>{' '}
                  <Button variant="danger" onClick={() => handleDeleteContact(contact._id)}>
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>

      <footer className="fixed-bottom text-center py-2 bg-light">
        <Button variant="outline-secondary" onClick={handleLogout}>
          Cerrar Sesión
        </Button>
      </footer>
    </div>
  );
};

export default Contactos;


//V3
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Nav, Navbar, Table, Form, Button } from 'react-bootstrap';

const Contactos = () => {
  const [contactName, setContactName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [contacts, setContacts] = useState([]);
  const [editingContact, setEditingContact] = useState(null); // New state for editing

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('token') !== null;

    if (!isAuthenticated) {
      window.location.href = '/login';
    } else {
      fetchContacts();
    }
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/contacts');
      setContacts(response.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const handleAddContact = async () => {
    try {
      const newContact = { alias: contactName, number: contactNumber };
      const response = await axios.post('http://localhost:4000/api/contacts', newContact);
      setContacts([...contacts, response.data]);
      setContactName('');
      setContactNumber('');
    } catch (error) {
      console.error('Error adding contact:', error);
    }
  };

  const handleDeleteContact = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/contacts/${id}`);
      setContacts(contacts.filter((contact) => contact._id !== id));
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setContactName(contact.alias);
    setContactNumber(contact.number);
  };

  const handleUpdateContact = async () => {
    try {
      const updatedContact = { alias: contactName, number: contactNumber };
      const response = await axios.put(`http://localhost:4000/api/contacts/${editingContact._id}`, updatedContact);
      setContacts(contacts.map(contact => contact._id === editingContact._id ? response.data : contact));
      setEditingContact(null);
      setContactName('');
      setContactNumber('');
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

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
              <Nav.Link href='/rutas'>Rutas</Nav.Link>
              <Nav.Link href='/estadisticas'>Estadisticas</Nav.Link>
              <Nav.Link href='/configuracion'>Configuración</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-5">
        <h1>Contactos</h1>
        <h2>{editingContact ? 'Editar Contacto' : 'Agregar Contacto Nuevo'}</h2>

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
          </tbody>
        </Table>

        <h2>Visualizar Contactos</h2>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Alias del Contacto</th>
              <th>Número del Contacto</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact._id}>
                <td>{contact._id}</td>
                <td>{contact.alias}</td>
                <td>{contact.number}</td>
                <td>
                  <Button variant="info" onClick={() => handleEditContact(contact)}>
                    Editar
                  </Button>{' '}
                  <Button variant="danger" onClick={() => handleDeleteContact(contact._id)}>
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>

      <footer className="fixed-bottom text-center py-2 bg-light">
        <Button variant="outline-secondary" onClick={handleLogout}>
          Cerrar Sesión
        </Button>
      </footer>
    </div>
  );
};

//V4
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { Container, Nav, Navbar, Table, Form, Button } from 'react-bootstrap';

const Contactos = () => {
  const [contactName, setContactName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [contacts, setContacts] = useState([]);
  const [userId, setUserId] = useState(null); // New state for user ID
  const [editingContact, setEditingContact] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const isAuthenticated = token !== null;

    if (!isAuthenticated) {
      window.location.href = '/login';
    } else {
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.userId); // Adjust based on your token structure
      fetchContacts(decodedToken.userId);
    }
  }, []);

  const fetchContacts = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/contacts?userId=${userId}`);
      setContacts(response.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const handleAddContact = async () => {
    try {
      const newContact = { alias: contactName, number: contactNumber, userId };
      const response = await axios.post('http://localhost:4000/api/contacts', newContact);
      setContacts([...contacts, response.data]);
      setContactName('');
      setContactNumber('');
    } catch (error) {
      console.error('Error adding contact:', error);
    }
  };

  const handleDeleteContact = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/contacts/${id}`);
      setContacts(contacts.filter((contact) => contact._id !== id));
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setContactName(contact.alias);
    setContactNumber(contact.number);
  };

  const handleUpdateContact = async () => {
    try {
      const updatedContact = { alias: contactName, number: contactNumber, userId };
      const response = await axios.put(`http://localhost:4000/api/contacts/${editingContact._id}`, updatedContact);
      setContacts(contacts.map(contact => contact._id === editingContact._id ? response.data : contact));
      setEditingContact(null);
      setContactName('');
      setContactNumber('');
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

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
              <Nav.Link href='/rutas'>Rutas</Nav.Link>
              <Nav.Link href='/estadisticas'>Estadisticas</Nav.Link>
              <Nav.Link href='/configuracion'>Configuración</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-5">
        <h1>Contactos</h1>
        <h2>{editingContact ? 'Editar Contacto' : 'Agregar Contacto Nuevo'}</h2>

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
          </tbody>
        </Table>

        <h2>Visualizar Contactos</h2>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Alias del Contacto</th>
              <th>Número del Contacto</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact._id}>
                <td>{contact._id}</td>
                <td>{contact.alias}</td>
                <td>{contact.number}</td>
                <td>
                  <Button variant="info" onClick={() => handleEditContact(contact)}>
                    Editar
                  </Button>{' '}
                  <Button variant="danger" onClick={() => handleDeleteContact(contact._id)}>
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>

      <footer className="fixed-bottom text-center py-2 bg-light">
        <Button variant="outline-secondary" onClick={handleLogout}>
          Cerrar Sesión
        </Button>
      </footer>
    </div>
  );
};

export default Contactos;

//Hopefully functional

import React, { useState, useEffect } from 'react';
import axios from 'axios';
//import jwtDecode from 'jwt-decode';  // Ensure jwt-decode is properly imported
import { jwtDecode } from "jwt-decode";
import { Container, Nav, Navbar, Table, Form, Button } from 'react-bootstrap';

const Contactos = () => {
  const [contactName, setContactName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [contacts, setContacts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [editingContact, setEditingContact] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const isAuthenticated = token !== null;

    if (!isAuthenticated) {
      window.location.href = '/login';
    } else {
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.userId); // Adjust based on your token structure
      fetchContacts(decodedToken.userId);
    }
  }, []);

  const fetchContacts = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/contacts?userId=${userId}`);
      setContacts(response.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const handleAddContact = async () => {
    try {
      const newContact = { alias: contactName, number: contactNumber, userId };
      const response = await axios.post('http://localhost:4000/api/contacts', newContact);
      setContacts([...contacts, response.data]);
      setContactName('');
      setContactNumber('');
    } catch (error) {
      console.error('Error adding contact:', error);
    }
  };

  const handleDeleteContact = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/contacts/${id}`);
      setContacts(contacts.filter((contact) => contact._id !== id));
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setContactName(contact.alias);
    setContactNumber(contact.number);
  };

  const handleUpdateContact = async () => {
    try {
      const updatedContact = { alias: contactName, number: contactNumber, userId };
      const response = await axios.put(`http://localhost:4000/api/contacts/${editingContact._id}`, updatedContact);
      setContacts(contacts.map(contact => contact._id === editingContact._id ? response.data : contact));
      setEditingContact(null);
      setContactName('');
      setContactNumber('');
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

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
              <Nav.Link href='/rutas'>Rutas</Nav.Link>
              <Nav.Link href='/estadisticas'>Estadisticas</Nav.Link>
              <Nav.Link href='/configuracion'>Configuración</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-5">
        <h1>Contactos</h1>
        <h2>{editingContact ? 'Editar Contacto' : 'Agregar Contacto Nuevo'}</h2>

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
          </tbody>
        </Table>

        <h2>Visualizar Contactos</h2>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Alias del Contacto</th>
              <th>Número del Contacto</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact._id}>
                <td>{contact._id}</td>
                <td>{contact.alias}</td>
                <td>{contact.number}</td>
                <td>
                  <Button variant="info" onClick={() => handleEditContact(contact)}>
                    Editar
                  </Button>{' '}
                  <Button variant="danger" onClick={() => handleDeleteContact(contact._id)}>
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>

      <footer className="fixed-bottom text-center py-2 bg-light">
        <Button variant="outline-secondary" onClick={handleLogout}>
          Cerrar Sesión
        </Button>
      </footer>
    </div>
  );
};

export default Contactos;
*/
//FUCK YOU
import React, { useState, useEffect } from 'react';
import axios from 'axios';
//import jwtDecode from 'jwt-decode';
import { jwtDecode } from "jwt-decode";
import { Container, Nav, Navbar, Table, Form, Button } from 'react-bootstrap';

const Contactos = () => {
  const [contactName, setContactName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [contacts, setContacts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [editingContact, setEditingContact] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const isAuthenticated = token !== null;

    if (!isAuthenticated) {
      window.location.href = '/login';
    } else {
      const decodedToken = jwtDecode(token);
      console.log('Decoded Token:', decodedToken); // Log decoded token
      setUserId(decodedToken.id); // Adjust based on your token structure
      fetchContacts(decodedToken.id);
    }
  }, []);

  const fetchContacts = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/contacts?userId=${userId}`);
      setContacts(response.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const handleAddContact = async () => {
    try {
      const newContact = { alias: contactName, number: contactNumber, userId };
      const response = await axios.post('http://localhost:4000/api/contacts', newContact);
      setContacts([...contacts, response.data]);
      setContactName('');
      setContactNumber('');
    } catch (error) {
      console.error('Error adding contact:', error);
    }
  };

  const handleDeleteContact = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/contacts/${id}`);
      setContacts(contacts.filter((contact) => contact._id !== id));
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setContactName(contact.alias);
    setContactNumber(contact.number);
  };

  const handleUpdateContact = async () => {
    try {
      const updatedContact = { alias: contactName, number: contactNumber, userId };
      const response = await axios.put(`http://localhost:4000/api/contacts/${editingContact._id}`, updatedContact);
      setContacts(contacts.map(contact => contact._id === editingContact._id ? response.data : contact));
      setEditingContact(null);
      setContactName('');
      setContactNumber('');
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

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
              <Nav.Link href='/rutas'>Rutas</Nav.Link>
              <Nav.Link href='/estadisticas'>Estadisticas</Nav.Link>
              <Nav.Link href='/configuracion'>Configuración</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-5">
        <h1>Contactos</h1>
        <h2>{editingContact ? 'Editar Contacto' : 'Agregar Contacto Nuevo'}</h2>

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
          </tbody>
        </Table>

        <h2>Visualizar Contactos</h2>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Alias del Contacto</th>
              <th>Número del Contacto</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact._id}>
                <td>{contact._id}</td>
                <td>{contact.alias}</td>
                <td>{contact.number}</td>
                <td>
                  <Button variant="info" onClick={() => handleEditContact(contact)}>
                    Editar
                  </Button>{' '}
                  <Button variant="danger" onClick={() => handleDeleteContact(contact._id)}>
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>

      <footer className="fixed-bottom text-center py-2 bg-light">
        <Button variant="outline-secondary" onClick={handleLogout}>
          Cerrar Sesión
        </Button>
      </footer>
    </div>
  );
};

export default Contactos;
