/*import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload. a mamarre
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

*/


import React from 'react'
import {BrowserRouter, Route} from 'react-router-dom'
import Inicio from './Home.js'
import Login from './Login.js'
import Signup from './Signup.js'
import Respass from './passfor.js'
import AcercaDe from './acercade.js'
import ModFis from './modfis.js'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/esm/Button.js'
//import { Link } from 'react-router-dom/cjs/react-router-dom.min'


const NavbarPrincipal = () => (
  <Container>
    <Navbar expand="xl" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home">SiNoMoto</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/inicio">Inicio</Nav.Link>
            <Nav.Link href="#link">Link</Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>                
        </Navbar.Collapse>
        <Button  variant="outline-primary">
          Iniciar Sesion
        </Button>
      </Container>
    </Navbar>  
    </Container>
  
);

const App = () => {
  return <div className="App">        
    
    <NavbarPrincipal/>
    <BrowserRouter>        
        <Route path="/login" exact component={Login}/>
        <Route path="/signup" exact component={Signup} />
        <Route path="/inicio" exact component={Inicio} />
        <Route path="/" exact component={Inicio} />      
        <Route path="/rescont" exact component={Respass} />
        <Route path="/acercade" exact component={AcercaDe} /> 
        <Route path="/modfis" exact component={ModFis} />      
    </BrowserRouter>
  </div>
}

export default App
