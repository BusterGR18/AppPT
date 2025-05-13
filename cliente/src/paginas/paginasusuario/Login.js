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
//V1
/*
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
        const response = await fetch('http://localhost:4000/api/v1/login', {
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

        console.log('Login response:', data); // Log response data

        if (response.ok) {
            localStorage.setItem('token', data.token);
            console.log('Token:', data.token); // Log token
            alert('Login successful');
            window.location.href = '/dash';
        } else {
            alert('Please check your username and password');
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('Error during login. Please try again.');
    }
};
////Comment here
  const loginUser = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:4000/api/v1/login', {
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
        console.log('exito')
        window.location.href = '/dashboard';
      } else {
        alert('Please check your username and password');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  }; ///Comment here

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

*/
//V2
import React, { useEffect,useState } from 'react';
import { Form, InputGroup, Button, Col, Container, Row, Nav,Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    if (prefersDarkScheme.matches) {
      document.body.classList.add('dark-mode');
      setIsDarkMode(true);
    } else {
      document.body.classList.remove('dark-mode');
      setIsDarkMode(false);
    }

    const handleDarkModeChange = (e) => {
      if (e.matches) {
        document.body.classList.add('dark-mode');
        setIsDarkMode(true);
      } else {
        document.body.classList.remove('dark-mode');
        setIsDarkMode(false);
      }
    };

    prefersDarkScheme.addEventListener('change', handleDarkModeChange);

    return () => {
      prefersDarkScheme.removeEventListener('change', handleDarkModeChange);
    };
  }, []);

  const loginUser = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/login`, {
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

      console.log('Login response:', data); // Log response data

      if (response.ok) {
        localStorage.setItem('token', data.token);
        console.log('Token:', data.token); // Log token
        alert('Login successful');

        // Check the usertype and redirect accordingly
        if (data.User.usertype === 'admin') {
          window.location.href = '/admindash';
        } else {
          window.location.href = '/dash';
        }
      } else {
        alert('Please check your username and password');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Error during login. Please try again.');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
    <Navbar expand="lg" bg="dark" variant="dark" className="w-100" style={{ padding: 0 }}>
            <Container fluid className="px-3 d-flex justify-content-between align-items-center">
              <Navbar.Brand href="/" className="fw-bold fs-4 m-0">SiNoMoto</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ms-auto">
                  <Nav.Link href="/modfis">Módulo</Nav.Link>
                  <Nav.Link href="/acercade">Nosotros</Nav.Link>
                  <Nav.Link href="/signup">Registrarse</Nav.Link>
                  <Nav.Link href="/login">Iniciar Sesión</Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
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
                  onChange={(e) => setEmail(e.target.value)} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Contraseña</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} />
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
      <footer className={isDarkMode ? 'footer-dark-mode' : 'footer-light'}>
      <Container>
        <p className="footer-text">© 2024 SiNoMoto. PT2</p>
      </Container>
    </footer>
      </>
  );
}

export default App;
    