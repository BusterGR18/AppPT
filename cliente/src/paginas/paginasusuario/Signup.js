/*import React, { useState } from 'react';
import { Form,  Button, Container, Row, Col, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Signup() {
  const [nombre,setNombre] = useState('');	
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [iddispositivo, setIDDis] = useState('');
  const [numtel, setNumTel] = useState('');
  const [tiposangre, setTipoSangre] = useState('');

  async function registerUser(event) {
    event.preventDefault();

    // Logica reciclada del login
	// Implementar logica signup
	
	event.preventDefault()

		const response = await fetch('http://localhost:3900/api/signup', {
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

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <h1 className="text-center">Registro</h1>
          <Form onSubmit={registerUser}>
            <Form.Group className="mb-3">
              <Form.Control
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                type="text"
                placeholder="Nombre"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Correo Electrónico"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Contraseña"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                value={iddispositivo}
                onChange={(e) => setIDDis(e.target.value)}
                type="text"
                placeholder="ID. del Dispositivo"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                value={numtel}
                onChange={(e) => setNumTel(e.target.value)}
                type="text"
                placeholder="Número Telefónico"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Select
                aria-label="Default select example"
                value={tiposangre}
                onChange={(e) => setTipoSangre(e.target.value)}
              >
                <option>Tipo de Sangre</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </Form.Select>
            </Form.Group>

            <Nav className="mb-3">
              <Nav.Link as={Link} to="/polpriv">
                Conoce nuestra política de privacidad
              </Nav.Link>
            </Nav>

            <Form.Group className="mb-3" controlId="checkbox-pp">
              <Form.Check type="checkbox" label="Estoy de acuerdo" />
            </Form.Group>

            <Button variant="primary" size="lg" type="submit" className="w-100">
              Registrarse
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Signup;

*/

//V2
/*
import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Nav } from 'react-bootstrap';
import { Link , useHistory} from 'react-router-dom';


function Signup() {
	const history = useHistory()
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [iddispositivo, setIDDis] = useState('');
  const [numtel, setNumTel] = useState('');
  const [tiposangre, setTipoSangre] = useState('');
  const [error, setError] = useState('');

  async function registerUser(event) {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
	console.log({
		name,
		email,
		password,
		numtel,
		tiposangre,
	  });

    const response = await fetch('http://localhost:4000/api/v1/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,        
        numtel,
        tiposangre,
        usertype: "client",
      }),
    });


    const data = await response.json();
	

	console.log(data); 

    if (data.status === 'ok') {
		history.push('/login')

	}
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <h1 className="text-center">Registro</h1>
          <Form onSubmit={registerUser}>
            <Form.Group className="mb-3">
              <Form.Control
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="Nombre"
                required
              />
            </Form.Group>            

            <Form.Group className="mb-3">
              <Form.Control
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Correo Electrónico"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Contraseña"
              />
            </Form.Group>

			<Form.Group className="mb-3">
              <Form.Control
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type="password"
                placeholder="Confirmar Contraseña"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                value={iddispositivo}
                onChange={(e) => setIDDis(e.target.value)}
                type="text"
                placeholder="ID. del Dispositivo"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                value={numtel}
                onChange={(e) => setNumTel(e.target.value)}
                type="text"
                placeholder="Número Telefónico"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Select
                aria-label="Default select example"
                value={tiposangre}
                onChange={(e) => setTipoSangre(e.target.value)}
              >
                <option>Tipo de Sangre</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </Form.Select>
            </Form.Group>   

			<Nav className="mb-3">
              <Nav.Link as={Link} to="/polpriv">
                Conoce nuestra política de privacidad
              </Nav.Link>
            </Nav>

            <Form.Group className="mb-3" controlId="checkbox-pp">
              <Form.Check type="checkbox" label="Estoy de acuerdo" required />
            </Form.Group> 


            <Button variant="primary" size="lg" type="submit" className="w-100">
              Registrarse
            </Button>
			

            {error && <p className="text-danger mt-2">{error}</p>}        

          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Signup;
*/

import React, { useEffect,useState } from 'react';
import { Form, InputGroup, Button, Col, Container, Row, Nav,Navbar } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';

function Signup() {
    const history = useHistory();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [iddispositivo, setIDDis] = useState('');
    const [numtel, setNumTel] = useState('');
    const [tiposangre, setTipoSangre] = useState('');
    const [acceptedTerms, setAcceptedTerms] = useState(false); // State for checkbox
    const [error, setError] = useState('');
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

    async function registerUser(event) {
        event.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!acceptedTerms) {
            setError('Please accept the terms and conditions');
            return;
        }

        try {
            const response = await fetch('http://localhost:4000/api/v1/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    iddispositivo,
                    numtel,
                    tiposangre,
                    role: "client", // Set role to 'client' by default
                }),
            });

            const data = await response.json();
            console.log(data);

            if (response.ok) {
                alert('Registration successful! Please log in.');
                history.push('/login');
            } else {
                setError(data.message || 'An error occurred');
            }
        } catch (error) {
            console.error('Error during user registration:', error);
            setError('An error occurred');
        }
    }

    return (
      <><Navbar className={isDarkMode ? 'navbar-dark-mode' : 'navbar-light'} expand="lg" fixed="top">
        <Container>
          <Navbar.Brand href="/">SiNoMoto</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              <Nav.Link href="/login">Iniciar Sesion</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar><Container className="mt-5">
          <Row className="justify-content-center">
            <Col md={6}>
              <h1 className="text-center">Registro</h1>
              <Form onSubmit={registerUser}>
                {/* Input fields for user registration */}
                {/* ... */}
                <Form.Group className="mb-3">
                  <Form.Control
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    placeholder="Nombre"
                    required />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Control
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="Correo Electrónico" />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Control
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="Contraseña" />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Control
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    type="password"
                    placeholder="Confirmar Contraseña" />
                </Form.Group>


                <Form.Group className="mb-3">
                  <Form.Control
                    value={iddispositivo}
                    onChange={(e) => setIDDis(e.target.value)}
                    type="text"
                    placeholder="ID. del Dispositivo" />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Control
                    value={numtel}
                    onChange={(e) => setNumTel(e.target.value)}
                    type="text"
                    placeholder="Número Telefónico" />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Select
                    aria-label="Default select example"
                    value={tiposangre}
                    onChange={(e) => setTipoSangre(e.target.value)}
                  >
                    <option>Tipo de Sangre</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </Form.Select>
                </Form.Group>

                <Nav className="mb-3">
                  <Nav.Link as={Link} to="/polpriv">
                    Conoce nuestra política de privacidad
                  </Nav.Link>
                </Nav>




                <Form.Group className="mb-3" controlId="checkbox-terms">
                  <Form.Check
                    type="checkbox"
                    label="Estoy de acuerdo con los términos y condiciones"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    required />
                </Form.Group>
                <Button variant="primary" size="lg" type="submit" className="w-100">
                  Registrarse
                </Button>
                {error && <p className="text-danger mt-2">{error}</p>}
              </Form>
            </Col>
          </Row>
        </Container>
        <footer className={isDarkMode ? 'footer-dark-mode' : 'footer-light'}>
      <Container>
        <p className="footer-text">© 2024 SiNoMoto. PT2</p>
      </Container>
    </footer></>
    );
}

export default Signup;
