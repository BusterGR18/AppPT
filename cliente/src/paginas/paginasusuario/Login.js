/*import { useState } from 'react'
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import InputGroup from 'react-bootstrap/Form'
import Button  from 'react-bootstrap/esm/Button';
import Nav from 'react-bootstrap/Nav';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';


function App() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [showPassword, setShowPassword] = useState(false);

	async function loginUser(event) {
		event.preventDefault()

		const response = await fetch('http://localhost:1337/api/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email,
				password,
			}),
		})

		const data = await response.json()

		if (data.user) {
			localStorage.setItem('token', data.user)
			alert('Login successful')
			window.location.href = '/dashboard'
		} else {
			alert('Please check your username and password')
		}
	}

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	  };

	return (
		<div>
			<h1>Bienvenido</h1>
			<Form>
			<form onSubmit={loginUser}>
				<input
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					type="email"
					placeholder="Correo"
				/>
				<br />
				
				<InputGroup className="mb-3">
        			<Form.Control
          				type={showPassword ? 'text' : 'password'}
          				placeholder="Contraseña"
          				value={password}
          				onChange={(e) => setPassword(e.target.value)}
        			/>
        		<Button
          			variant="outline-secondary"
          			onClick={togglePasswordVisibility}
        		>
          		{showPassword ? 'Ocultar' : 'Mostrar'}
        		</Button>
      			</InputGroup>
				<Nav>
      				<Nav.Link as={Link} to="/rescont">
        				Olvidaste tu Contraseña?
      				</Nav.Link>
    			</Nav>
				<Button variant="primary" size="lg" input type="submit" value="Login" >
        			Iniciar sesion
      			</Button>
				<br/>
				<Nav>
      				<Nav.Link as={Link} to="/rescont">
        				No tienes cuenta? Registrate.
      				</Nav.Link>
    			</Nav>

			</form>
			</Form>
		</div>
	)
}

export default App
*/
import React, { useState } from 'react';
import { Form, InputGroup, Button, Col, Container, Row, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const loginUser = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:3900/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (data.user) {
        localStorage.setItem('token', data.user);
        alert('Login successful');
        window.location.href = '/dashboard';
      } else {
        alert('Please check your username and password');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <h1 className="text-center mb-4">Bienvenido</h1>
          <Form onSubmit={loginUser}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Correo</Form.Label>
              <Form.Control
                type="email"
                placeholder="Correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  variant="outline-secondary"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </Button>
              </InputGroup>
            </Form.Group>

            <Nav>
              <Nav.Link as={Link} to="/rescont">
                Olvidaste tu Contraseña?
              </Nav.Link>
            </Nav>

            <Button variant="primary" size="lg" type="submit" className="w-100 mt-3">
              Iniciar sesión
            </Button>

            <Row className="mt-3">
              <Col>
                <Nav>
                  <Nav.Link as={Link} to="/signup">
                    No tienes cuenta? Regístrate.
                  </Nav.Link>
                </Nav>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
