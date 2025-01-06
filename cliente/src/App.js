import React from 'react'
import {BrowserRouter, Route, Switch, Link } from 'react-router-dom'
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
import ReporteAccidentes from './paginas/tablero/accidentes.js'
import AccidentesInvitados from './paginas/tablero/invacc.js'
import AdminModulos from './paginas/tablero/modulosmgmt.js'
import NotFound from './paginas/Notf.js';
import NavbarPrincipal from './paginas/Notf.js'

const App = () => {
  return <div className="App">            
    
    <BrowserRouter> 
      <Switch>                 
          <Route path="/login" exact component={Login}/>
          <Route path="/signup" exact component={Signup} />          
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
          <Route path="/accidentes" exact component={ReporteAccidentes}/>
          <Route path="/accidentes-invitados" exact component={AccidentesInvitados}/>
          <Route path="/modulos" exact component={AdminModulos}/>
          <ProtectedRoute path="/admindash" exact component={AdminDash} />
          <ProtectedRoute path="/adminusers" exact component={AdminUsers} />
          <ProtectedRoute path="/adminsettings" exact component={AdminSettings} />
          <ProtectedRoute path="/admintelemetry" exact component={AdminTelemetry} />
          <Route path="*" component={NotFound} />
      </Switch>  
    </BrowserRouter>
  </div>
}

export default App  
