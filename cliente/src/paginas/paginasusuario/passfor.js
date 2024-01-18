import React, { useState } from 'react';
import { Form, InputGroup, Button, Container, Row, Col, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function PasswordResetPage() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const resetPassword = async (event) => {
    event.preventDefault();

    // Include your password reset logic here
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleCancel = () => {
    // Add logic to handle cancellation
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <h1 className="text-center">Restablecer Contraseña</h1>
          <Form onSubmit={resetPassword}>
            <Form.Group className="mb-3">
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Ingrese su correo electrónico"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nueva Contraseña</Form.Label>
              <InputGroup>
                <Form.Control
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Nueva contraseña"
                />
                <Button
                  variant="outline-secondary"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </Button>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirmar Contraseña</Form.Label>
              <Form.Control
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type="password"
                placeholder="Confirme la nueva contraseña"
              />
            </Form.Group>

            <Button variant="primary" size="lg" type="submit" className="w-100">
              Restablecer Contraseña
            </Button>

            <Button variant="secondary" size="lg" className="w-100 mt-3" onClick={handleCancel}>
              Cancelar
            </Button>
          </Form>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col className="text-center">
          <Nav>
            <Nav.Link as={Link} to="/login">
              Volver a Iniciar Sesión
            </Nav.Link>
          </Nav>
        </Col>
      </Row>
    </Container>
  );
}

export default PasswordResetPage;
