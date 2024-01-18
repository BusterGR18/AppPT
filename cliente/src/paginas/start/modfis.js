import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

const ProductDetails = () => {
  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8} className="text-center">
          <h1>Detalles del sistema</h1>
          <p className="lead">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec bibendum magna lacus, a fermentum ipsum cursus sed. Vestibulum
          </p>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col md={6}>
          <img
            src="https://64.media.tumblr.com/bef61f8cb7f9791503727fc26cff0925/31511d3136396c71-20/s500x750/f2ac4fa1f8ff862e71336987076abc0b010a25b8.png"
            alt="Imagen modulo"
            className="img-fluid rounded"
          />
        </Col>
        <Col md={6}>
          <h2>Modulo</h2>
          <p>            
            Donec lorem augue, elementum hendrerit felis sed, congue porttitor urna. Integer eleifend elementum ultricies. Aenean felis lacus, venenatis et imperdiet id, feugiat rutrum tellus.
          </p>
          <ul>
            <li>Característica 1</li>
            <li>Característica 2</li>
            <li>Característica 3</li>
          </ul>
          <Button variant="primary">
            Comprar Ahora
          </Button>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col md={12} className="text-center">
          <h2>Beneficios Clave</h2>
          <ul>
            <li>Beneficio 1: usce imperdiet nulla semper justo aliquet, in consequat nisi accumsan.</li>
            <li>Beneficio 2: unc gravida dui porta, gravida felis eget, molestie velit. Praesent a aliquet lacus, quis interdum orci. </li>
            <li>Beneficio 3: Vestibulum vitae neque justo. Cras blandit sapien vel lacus maximus mattis sed et leo. </li>
          </ul>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col md={12} className="text-center">
          <h2>Opiniones de Clientes</h2>
          <p>
            "Maecenas rutrum nisl lorem, id aliquet sapien pretium non. " - Mamberroi
          </p>
          <p>
            "nteger ac tortor eu felis bibendum feugiat vel eget erat. Duis at suscipit lacus, quis euismod nibh. Duis volutpat ultrices porta. " - Danny Flow
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetails;
