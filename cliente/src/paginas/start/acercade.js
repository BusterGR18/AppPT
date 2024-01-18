import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

const AcercaDe = () => {
  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8} className="text-center">
          <h1>Acerca de Nosotros</h1>
          <p className="lead">
            Bienvenido a SiNoMoto, donde la seguridad en la carretera es nuestra principal prioridad.
          </p>
          <p>
            En SiNoMoto, nos dedicamos a proporcionar soluciones innovadoras para mejorar la seguridad de los motociclistas. Nuestra misión es reducir los accidentes de motocicletas y sus consecuencias mediante el uso de tecnología avanzada.
          </p>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col md={6}>
          <img
            src="https://via.placeholder.com/600x400"
            alt="Team Showcase"
            className="img-fluid rounded"
          />
        </Col>
        <Col md={6}>
          <h2>Nuestro Equipo</h2>
          <p>
            En SiNoMoto, contamos con un equipo apasionado de profesionales dedicados a crear soluciones que salvan vidas. Desde ingenieros hasta expertos en seguridad vial, nuestro equipo está comprometido con la seguridad de los motociclistas en todo momento.
          </p>
          <Button variant="primary" href="/contact-us">
            Contáctenos
          </Button>
        </Col>
      </Row>

      <Row className="mt-5">
        <Col md={12} className="text-center">
          <h2>Nuestra Visión</h2>
          <p>
            Buscamos un futuro donde cada motociclista pueda disfrutar de la carretera con total seguridad. Nos esforzamos por desarrollar tecnologías que reduzcan los accidentes y salven vidas.
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default AcercaDe;
