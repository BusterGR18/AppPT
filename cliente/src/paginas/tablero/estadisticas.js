//Dark mode
import React, { useEffect, useState } from 'react';
import { Container, Form, Nav, Navbar, NavDropdown, Alert, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSadTear, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { FaUserCircle } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const createCustomIcon = (visitCount) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color:#007bff; color: white; padding: 5px; border-radius: 50%; width: ${
      20 + visitCount * 2
    }px; height: ${20 + visitCount * 2}px; display: flex; align-items: center; justify-content: center;">${visitCount}</div>`,
    iconSize: [20 + visitCount * 2, 20 + visitCount * 2],
  });
};

const Estadisticas = () => {
  const [settings, setSettings] = useState({ enableStatistics: false, enableGuestMode: false, displayStatistics: [] });
  const [userEmail, setUserEmail] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [statisticsData, setStatisticsData] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [topLocations, setTopLocations] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState('');
  const [dateRange, setDateRange] = useState('7d');

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const fetchStatisticsData = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/statistics/user?useremail=${userEmail}`);
      setStatisticsData(response.data);

      const board = response.data.boards.find((b) => b.boardid === selectedBoard);
      if (board) {
        setTopLocations(board.topLocations);
      }
    } catch (error) {
      console.error("Error fetching statistics data:", error);
    }
  };

  const calculateStartDate = () => {
    const ranges = {
      '7d': 7,
      '30d': 30,
      '3m': 90,
      '1y': 365,
    };
    return new Date(Date.now() - (ranges[dateRange] || 7) * 24 * 60 * 60 * 1000).toISOString();
  };
  

  const fetchHistoricalData = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/historical-data', {
        params: {
          userEmail,
          boardId: selectedBoard,
          startDate: calculateStartDate(),
          endDate: new Date().toISOString(),
        },
      });
      console.log('Historical Data Response:', response.data);
      setHistoricalData(response.data);
    } catch (error) {
      console.error('Error fetching historical data:', error);
    }
  };
  
  

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
    } else {
      const decodedToken = jwtDecode(token);
      setUserEmail(decodedToken.email);
    }
  }, []);

  useEffect(() => {
    if (userEmail) {
      const fetchSettings = async () => {
        try {
          const response = await axios.get(`http://localhost:4000/api/settings/?useremail=${userEmail}`);
          setSettings(response.data);
          if (response.data.enableStatistics) fetchStatisticsData();
        } catch (error) {
          console.error('Error fetching settings:', error);
        }
      };
      fetchSettings();
    }
  }, [userEmail]);

  useEffect(() => {
    if (selectedBoard) {
      fetchStatisticsData();
    }
  }, [selectedBoard]);

  useEffect(() => {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(prefersDarkScheme.matches);
  
    const handleDarkModeChange = (e) => {
      setIsDarkMode(e.matches);
      document.body.classList.toggle('dark-mode', e.matches); // Add or remove 'dark-mode' class
    };
  
    // Initial check and listener for system dark mode preference
    prefersDarkScheme.addEventListener('change', handleDarkModeChange);
    document.body.classList.toggle('dark-mode', prefersDarkScheme.matches);
  
    return () => {
      prefersDarkScheme.removeEventListener('change', handleDarkModeChange);
    };
  }, []);

  useEffect(() => {
    if (selectedBoard && dateRange) {
      fetchHistoricalData();
    }
  }, [selectedBoard, dateRange]);

  const statisticLabels = {
    distanceTraveled: 'Distancia Recorrida (km)',
    averageSpeed: 'Velocidad Promedio (km/h)',
    maxSpeed: 'Velocidad Máxima (km/h)',
    totalRideDuration: 'Duración Total del Viaje (horas)',
    accidentCount: 'Conteo de Accidentes',
    guestModeStats: 'Duración del Modo Invitado (horas)',
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' },
      title: { display: false },
    },
  };

  const renderCharts = () => {
    return settings.displayStatistics
      .filter((stat) => stat !== 'topLocations')
      .map((stat) => {
        const data = historicalData.map((entry) => entry.data[stat]);
        const labels = historicalData.map((entry) => new Date(entry.date).toLocaleDateString());
        const chartData = {
          labels,
          datasets: [
            {
              label: statisticLabels[stat] || stat,
              data,
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
            },
          ],
        };
        return (
          <div key={stat} className="chart-wrapper mb-4">
            <h4>{statisticLabels[stat] || stat}</h4>
            <Line data={chartData} options={chartOptions} />
          </div>
        );
      });
  };

  return (
    <div>
      <Navbar className={isDarkMode ? 'navbar-dark-mode' : 'navbar-light'} expand="lg" fixed="top">
        <Container className="navbar-container">
          <Navbar.Brand href="/">SiNoMoto</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              <Nav.Link href='/dash'>Inicio</Nav.Link>
              <Nav.Link href='/contactos'>Contactos</Nav.Link>
              <NavDropdown title="Rutas" id="basic-nav-dropdown">
                <NavDropdown.Item href="/registerruta">Registrar Nueva Ruta</NavDropdown.Item>
                <NavDropdown.Item href="/viewrutas">Visualizar Rutas Existentes</NavDropdown.Item>
                <NavDropdown.Item href="/deleterutas">Eliminar Rutas</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link href='/estadisticas'>Estadisticas</Nav.Link>
              <Nav.Link href='/configuracion'>Configuración</Nav.Link>
              <Dropdown className="profile-dropdown" align="items-end">
                <Dropdown.Toggle variant="link" id="profile-dropdown">
                  <FaUserCircle size={24} color="#fff" />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={handleLogout}>Cerrar Sesión</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>  
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container id="estadisticas-container" className={`${isDarkMode ? 'container-dark' : 'container'}`}>
        {settings.enableGuestMode ? (
          <Alert variant="warning">
            <FontAwesomeIcon icon={faExclamationTriangle} size="2x" />
            <h4>Modo de invitado activado</h4>
            <p>⚠ Esta funcionalidad está restringida cuando habilitas el modo de invitado ⚠</p>
          </Alert>
        ) : settings.enableStatistics ? (
          <div>
            <h1>Tus Estadísticas</h1>
            <Form.Group controlId="boardSelect">
              <Form.Label className={isDarkMode ? 'form-label-dark' : ''}>Selecciona el ID del Board</Form.Label>
              <Form.Control
                as="select"
                onChange={(e) => setSelectedBoard(e.target.value)}
                className={isDarkMode ? 'form-control-dark' : ''}
              >
                <option value="">Selecciona un board</option>
                {statisticsData?.boards?.map((board) => (
                  <option key={board.boardid} value={board.boardid}>{board.boardid}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="dateRangeSelect">
              <Form.Label className={isDarkMode ? 'form-label-dark' : ''}>Selecciona el rango de fechas</Form.Label>
              <Form.Control
                as="select"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className={isDarkMode ? 'form-control-dark' : ''}
              >
                <option value="7d">Últimos 7 días</option>
                <option value="30d">Últimos 30 días</option>
                <option value="3m">Últimos 3 meses</option>
                <option value="1y">Último año</option>
              </Form.Control>
            </Form.Group>

            {settings.displayStatistics.includes('topLocations') && topLocations.length > 0 && (
              <>
                <h4 className="mt-4">Top Ubicaciones Visitadas</h4>
                <MapContainer center={[topLocations[0].latitude, topLocations[0].longitude]} zoom={13} style={{ height: "500px", marginTop: "20px" }}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  {topLocations.map((location, index) => (
                    <Marker
                      key={index}
                      position={[location.latitude, location.longitude]}
                      icon={createCustomIcon(location.visitCount)}
                    >
                      <Popup>
                        <strong>Visit Count:</strong> {location.visitCount} <br />
                        <strong>Coordinates:</strong> {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </>
            )}

            {historicalData.length > 0 ? renderCharts() : <p>Selecciona un board y rango de fechas para ver datos históricos.</p>}
          </div>
        ) : (
          <div>
            <h1>Advertencia: No tienes tus estadísticas habilitadas</h1>
            <FontAwesomeIcon icon={faSadTear} size="4x" className="text-warning mt-3" />
            <p>Si deseas habilitarlas, haz clic <Link to="/configuracion">aquí</Link>.</p>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Estadisticas;
