import React, { useState, useEffect } from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap'; // Import react-bootstrap components
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';

import { useContext } from 'react';
import { __RouterContext } from 'react-router';

const DebugRouterContext = () => {
  const context = useContext(__RouterContext);
  console.log('Router Context:', context);
  return null;
};
const NavbarPrincipal = () => (
    <Navbar bg="light" expand="lg" fixed="top">
    <Container>
      <Navbar.Brand as={Link} to="/">SiNoMoto</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <Nav.Link as={Link} to="/inicio">
            Inicio
          </Nav.Link>          
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
    
  );
const NotFound = () => {
  const [animalImage, setAnimalImage] = useState(null); // State for the image URL
  const [animalType, setAnimalType] = useState(''); // State for the animal type

  useEffect(() => {
    const isDog = Math.random() > 0.5; // 50% chance for dog or cat
    const apiUrl = isDog
      ? 'https://placedog.net/400/300' // Dog API
      : 'https://cataas.com/cat'; // Cat API

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not OK');
        }
        return response.blob();
      })
      .then(imageBlob => {
        const imageObjectURL = URL.createObjectURL(imageBlob);
        setAnimalImage(imageObjectURL); // Update the image URL in state
        setAnimalType(isDog ? 'Perro' : 'Gato'); // Update the animal type in state
      })
      .catch(error => console.error('Error fetching image:', error));
  }, []); // Empty dependency array ensures this runs once on component mount

  return (
    <div>
        <NavbarPrincipal />
        <DebugRouterContext/>
    
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>404 - Oh-oh no deberias de estar aquí</h1>
      <p>Lo que estas buscando ya no existe o nunca existió, quizá es tu esquizofrenia.</p>
      <p>Para que te alegres aquí esta un gato o perro:</p>      
      <p>{animalType}</p>
      {animalImage ? (
        <img src={animalImage} alt="Random animal" style={{ maxWidth: '100%', borderRadius: '10px' }} />
      ) : (
        <p>Tu amigo peludo esta en camino...</p>
      )}
      <p>
        <a href="/" style={{ color: '#007bff', textDecoration: 'none' }}>
          Regresa al Inicio c:
        </a>
      </p>
    </div>
    </div>
  );
};

export default NotFound;
