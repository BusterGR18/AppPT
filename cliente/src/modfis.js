import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

const ProductDetails = () => {
  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8} className="text-center">
          <h1>Detalles del Producto</h1>
          <p className="lead">
            Descubre las características asombrosas y los beneficios de nuestro producto innovador.
          </p>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col md={6}>
          <img
            src="https://via.placeholder.com/600x400"
            alt="Product Showcase"
            className="img-fluid rounded"
          />
        </Col>
        <Col md={6}>
          <h2>Producto Destacado</h2>
          <p>
            Nuestro producto revolucionario está diseñado para ofrecer la máxima comodidad y seguridad. Desde características avanzadas hasta un diseño elegante, nuestro producto se adapta a tus necesidades.
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
            <li>Beneficio 1: Mejora la seguridad en la carretera.</li>
            <li>Beneficio 2: Diseño ergonómico para mayor comodidad.</li>
            <li>Beneficio 3: Tecnología de última generación.</li>
          </ul>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col md={12} className="text-center">
          <h2>Opiniones de Clientes</h2>
          <p>
            "¡Este producto ha cambiado mi experiencia en la carretera! La tecnología y la seguridad nunca han sido tan accesibles." - Cliente Satisfecho
          </p>
          <p>
            "Increíblemente impresionado con la calidad y el rendimiento del producto. ¡Altamente recomendado!" - Otro Cliente Feliz
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetails;
