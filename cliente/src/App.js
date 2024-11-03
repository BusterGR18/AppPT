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
import Inicio from './paginas/start/Home.js'
import Login from './paginas/paginasusuario/Login.js'
import Signup from './paginas/paginasusuario/Signup.js'
import Respass from './paginas/paginasusuario/passfor.js'
import AcercaDe from './paginas/start/acercade.js'
import ModFis from './paginas/start/modfis.js'
import Contactos from './paginas/tablero/contactos.js'
import Rutas from './paginas/tablero/rutas.js'
import ViewRutas from './paginas/tablero/Polys/view-rutas.js'
import DeleteRutas from './paginas/tablero/Polys/delete-rutas.js'
import Estadisticas from './paginas/tablero/estadisticas.js'
import Configuracion from './paginas/tablero/configuracion.js'
import Dashboard from './paginas/tablero/Dash.js'
import HistorialAE from './paginas/tablero/historialae.js'
import AdminDash from './paginas/adminpages/admindash.js'; // Adjust the path if necessary
import ProtectedRoute from './ProtectedRoute'; 
import { Container, Nav,  Navbar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import RegisterRuta from './paginas/tablero/Polys/registerroute.js'
import AdminUsers from './paginas/adminpages/adminusers.js'
import AdminSettings from './paginas/adminpages/adminsettings.js'
import AdminTelemetry from './paginas/adminpages/admintelemtry.js'
import Invitados from './paginas/tablero/invitados.js'


const NavbarPrincipal = () => (
  <Navbar bg="light" expand="lg" fixed="top">
        <Container>
          <Navbar.Brand href="/">SiNoMoto</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              <Nav.Link href="/inicio">Inicio</Nav.Link>
              <Nav.Link href="/inicio">Si ves esto es por que falta un navbar</Nav.Link>              
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
  
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
        <Route path="/dash" exact component={Dashboard} />      
        <Route path="/contactos" exact component={Contactos} />      
        <Route path="/rutas" exact component={Rutas} />     
        <Route path="/viewrutas" exact component={ViewRutas} /> 
        <Route path="/deleterutas" exact component={DeleteRutas} /> 
        <Route path="/registerruta" exact component={RegisterRuta} />
        <Route path="/estadisticas" exact component={Estadisticas}/>
        <Route path="/configuracion" exact component={Configuracion}/>
        <Route path="/historial" exact component={HistorialAE}/>
        <Route path="/configinvitados" exact component={Invitados}/>
        <ProtectedRoute path="/admindash" exact component={AdminDash} />
        <ProtectedRoute path="/adminusers" exact component={AdminUsers} />
        <ProtectedRoute path="/adminsettings" exact component={AdminSettings} />
        <ProtectedRoute path="/admintelemetry" exact component={AdminTelemetry} />
    </BrowserRouter>
  </div>
}

export default App  
