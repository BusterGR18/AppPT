//V1
/*
import { useState } from 'react'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';


function App() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [iddispositivo, setIDDis] = useState('')
	const [numtel, setNumTel] = useState('')
	const [tiposangre, setTipoSangre] = useState('')

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

	return (
		<div>
			<h1>Registro</h1>
			<form onSubmit={loginUser}>
			<input
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					type="text"
					placeholder="Nombre"
				/>
				<br />
				<input
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					type="email"
					placeholder="Correo Electronico"
				/>
				<br />
				<input
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					type="password"
					placeholder="Contraseña"
				/>
				<br />
				<input
					value={iddispositivo}
					onChange={(e) => setIDDis(e.target.value)}
					type="text"
					placeholder="ID. del dispositivo"
				/>
				<br />
				<input
					value={numtel}
					onChange={(e) => setNumTel(e.target.value)}
					type="text"
					placeholder="Numero telefonico"
				/>
				<br />
				<Form.Select aria-label="Default select example" value={tiposangre} onChange={(e) => setTipoSangre(e.target.value)}>
      				<option>Tipo de sangre</option>
      				<option value="O+">O+</option>
      				<option value="O-">O-</option>
      				<option value="A+">A+</option>
					<option value="A-">A-</option>
					<option value="B+">B+</option>
					<option value="B-">B-</option>
					<option value="AB+">AB+</option>
					<option value="AB-">AB-</option>
    			</Form.Select>
				<Nav>
      				<Nav.Link as={Link} to="/polpriv">
        				Conoce nuestra politica de privacidad
      				</Nav.Link>
    			</Nav>
				<Form.Check // prettier-ignore
            		type='checkbox'
            		id="checkbox-pp"
            		label="Estoy de acuerdo"
          		/>
				<Button variant="primary" size="lg" input type="submit" value="Login" >
        			Registrarse
      			</Button>
				
			</form>
		</div>
	)
}

export default App
*/
import React, { useState } from 'react';
import { Form,  Button, Container, Row, Col, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Signup() {
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

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <h1 className="text-center">Registro</h1>
          <Form onSubmit={registerUser}>
            <Form.Group className="mb-3">
              <Form.Control
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

