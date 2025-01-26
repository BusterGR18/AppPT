//V1
// 
/*import React, { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa'; 
import { Container, Nav, Navbar, Tab, Row, Col, Dropdown, Table, Card } from 'react-bootstrap';
import axios from 'axios';

const WelcomeCard = ({ title, description, children }) => (
  <Card>
    <Card.Body>
      <Card.Title>{title}</Card.Title>
      <Card.Text>{description}</Card.Text>
      {children}
    </Card.Body>
  </Card>
);

const AdminDashboard = () => {
  const [userMetrics, setUserMetrics] = useState([]);
  const [systemLogs, setSystemLogs] = useState([]); // Ensure this is always an array
  const [userCount, setUserCount] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    const fetchUserMetrics = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/adminuser/clients');
        setUserMetrics(response.data || []);
        setUserCount(response.data?.length || 0); // Handle potential undefined response
      } catch (error) {
        console.error('Error fetching user metrics:', error);
        setUserMetrics([]); // Ensure fallback to empty array
      }
    };

    const fetchSystemLogs = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/admin/systemlogs');
        console.log('System Logs API Response:', response.data); // Debugging
        setSystemLogs(response.data.logs || []); // Extract logs array
      } catch (error) {
        console.error('Error fetching system logs:', error);
        setSystemLogs([]); // Fallback to empty array
      }
    };
    
    

    fetchUserMetrics();
    fetchSystemLogs();
  }, []);

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

  return (
    <div>
      <Container className="mt-5">
        <Navbar className={isDarkMode ? 'navbar-dark-mode' : 'navbar-light'} expand="lg" fixed="top">
          <Container className="navbar-container">
            <Navbar.Brand href="/">SiNoMoto</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ml-auto">
                <Nav.Link href='/admindash'>Vista general</Nav.Link>
                <Nav.Link href='/adminusers'>Usuarios</Nav.Link>
                <Nav.Link href='/admintelemetry'>Telemetria general</Nav.Link>
                <Nav.Link href='/adminsettings'>Configuración</Nav.Link>
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

        <Tab.Container id="admin-dashboard-tabs" defaultActiveKey="Overview">
          <Row>
            <Col md={12}>
              <Tab.Content>
                <Tab.Pane eventKey="Overview">
                  <h2>Bienvenido</h2>
                  <Row>
                    <Col md={6}>
                      <WelcomeCard
                        title="Usuarios del sistema"
                        description={`Total de usuarios registrados: ${userCount}`}
                      >
                        <Table striped bordered hover>
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Metric</th>
                              <th>Value</th>
                            </tr>
                          </thead>
                          <tbody>
                            {userMetrics.map((metric, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{metric.name}</td>
                                <td>{metric.value}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </WelcomeCard>
                    </Col>
                    <Col md={6}>
                      <WelcomeCard
                        title="System Logs"
                        description="Recent system activity logs"
                      >
                        <Table striped bordered hover>
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Timestamp</th>
                              <th>Log</th>
                            </tr>
                          </thead>
                          <tbody>
  {systemLogs.length > 0 ? (
    systemLogs.map((log, index) => (
      <tr key={log._id}>
        <td>{index + 1}</td>
        <td>{log.timestamp || 'N/A'}</td>
        <td>{log.severity || 'N/A'}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="3" className="text-center">No logs available.</td>
    </tr>
  )}
</tbody>


                        </Table>
                      </WelcomeCard>
                    </Col>
                  </Row>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    </div>
  );
};

export default AdminDashboard;
*/
//V2
/*
import React, { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa'; 
import { Container, Nav, Navbar, Tab, Row, Col, Dropdown, Table, Card, Pagination } from 'react-bootstrap';
import axios from 'axios';
import { format } from 'date-fns';

const WelcomeCard = ({ title, description, children }) => (
  <Card>
    <Card.Body>
      <Card.Title>{title}</Card.Title>
      <Card.Text>{description}</Card.Text>
      {children}
    </Card.Body>
  </Card>
);

const AdminDashboard = () => {
  const [userMetrics, setUserMetrics] = useState([]);
  const [systemLogs, setSystemLogs] = useState([]); // Full logs
  const [paginatedLogs, setPaginatedLogs] = useState([]); // Logs to display on the current page
  const [userCount, setUserCount] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 5; // Logs displayed per page

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    const fetchUserMetrics = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/adminuser/clients');
        setUserMetrics(response.data || []);
        setUserCount(response.data?.length || 0);
      } catch (error) {
        console.error('Error fetching user metrics:', error);
        setUserMetrics([]);
      }
    };

    const fetchSystemLogs = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/admin/systemlogs');
        setSystemLogs(response.data.logs || []);
        setCurrentPage(1); // Reset to page 1 when new logs are fetched
      } catch (error) {
        console.error('Error fetching system logs:', error);
        setSystemLogs([]);
      }
    };

    fetchUserMetrics();
    fetchSystemLogs();
  }, []);

  useEffect(() => {
    // Calculate logs to display on the current page
    const indexOfLastLog = currentPage * logsPerPage;
    const indexOfFirstLog = indexOfLastLog - logsPerPage;
    setPaginatedLogs(systemLogs.slice(indexOfFirstLog, indexOfLastLog));
  }, [currentPage, systemLogs]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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

  const renderPagination = () => {
    const totalPages = Math.ceil(systemLogs.length / logsPerPage);
    let items = [];
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item 
          key={number} 
          active={number === currentPage} 
          onClick={() => handlePageChange(number)}
        >
          {number}
        </Pagination.Item>
      );
    }
    return <Pagination>{items}</Pagination>;
  };

  return (
    <div>
      <Container className="mt-5">
        <Navbar className={isDarkMode ? 'navbar-dark-mode' : 'navbar-light'} expand="lg" fixed="top">
          <Container className="navbar-container">
            <Navbar.Brand href="/">SiNoMoto</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ml-auto">
                <Nav.Link href='/admindash'>Vista general</Nav.Link>
                <Nav.Link href='/adminusers'>Usuarios</Nav.Link>
                <Nav.Link href='/admintelemetry'>Telemetria general</Nav.Link>
                <Nav.Link href='/adminsettings'>Configuración</Nav.Link>
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

        <Tab.Container id="admin-dashboard-tabs" defaultActiveKey="Overview">
          <Row>
            <Col md={12}>
              <Tab.Content>
                <Tab.Pane eventKey="Overview">
                  <h2>Bienvenido</h2>
                  <Row>
                    <Col md={6}>
                      <WelcomeCard
                        title="Usuarios del sistema"
                        description={`Total de usuarios registrados: ${userCount}`}
                      >
                        <Table striped bordered hover>
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Metric</th>
                              <th>Value</th>
                            </tr>
                          </thead>
                          <tbody>
                            {userMetrics.map((metric, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{metric.name}</td>
                                <td>{metric.value}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </WelcomeCard>
                    </Col>
                    <Col md={6}>
                      <WelcomeCard
                        title="System Logs"
                        description="Recent system activity logs"
                      >
                        <Table striped bordered hover>
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Timestamp</th>
                              <th>Log</th>
                            </tr>
                          </thead>
                          
<tbody>
  {paginatedLogs.length > 0 ? (
    paginatedLogs.map((log, index) => (
      <tr key={log._id}>
        <td>{(currentPage - 1) * logsPerPage + index + 1}</td>
        <td>{log.timestamp ? format(new Date(log.timestamp), 'MMM dd, yyyy, hh:mm a') : 'N/A'}</td>
        <td>
          <span 
            className={`badge ${
              log.severity === 'error' ? 'bg-danger' : log.severity === 'warning' ? 'bg-warning' : 'bg-info'
            }`}
          >
            {log.severity || 'N/A'}
          </span>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="3" className="text-center">No logs available.</td>
    </tr>
  )}
</tbody>
                        </Table>
                        {renderPagination()}
                      </WelcomeCard>
                    </Col>
                  </Row>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    </div>
  );
};

export default AdminDashboard;
*/
//V3
/*
import React, { useEffect, useState } from 'react';
import { FaUserCircle, FaKey, FaTrash } from 'react-icons/fa';
import { Container, Nav, Navbar, Tab, Row, Col, Dropdown, Table, Card, Form, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { format } from 'date-fns';

const WelcomeCard = ({ title, description, children }) => (
  <Card>
    <Card.Body>
      <Card.Title>{title}</Card.Title>
      <Card.Text>{description}</Card.Text>
      {children}
    </Card.Body>
  </Card>
);

const AdminDashboard = () => {
  const [userMetrics, setUserMetrics] = useState([]);
  const [systemLogs, setSystemLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [activeUsersCount, setActiveUsersCount] = useState(0);
  const [criticalLogsCount, setCriticalLogsCount] = useState(0);
  const [eventsTodayCount, setEventsTodayCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const fetchUserMetrics = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/adminuser/clients');
      setUserMetrics(response.data || []);
      setUserCount(response.data?.length || 0);
      setActiveUsersCount(response.data?.filter(user => user.active).length || 0);
    } catch (error) {
      console.error('Error fetching user metrics:', error);
      setUserMetrics([]);
    }
  };

  const fetchSystemLogs = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/admin/systemlogs');
      const logs = response.data.logs || [];
      setSystemLogs(logs);
      setFilteredLogs(logs);
      setCriticalLogsCount(logs.filter(log => log.severity === 'error' || log.severity === 'warning').length);
    } catch (error) {
      console.error('Error fetching system logs:', error);
      setSystemLogs([]);
    }
  };

  const fetchEventsToday = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/admin/telemetry-summary');
      const todayCount = response.data.reduce((sum, event) => sum + (event.count || 0), 0);
      setEventsTodayCount(todayCount);
    } catch (error) {
      console.error('Error fetching telemetry events:', error);
    }
  };

  const handleSearchAndFilter = () => {
    let logs = systemLogs;

    if (searchTerm) {
      logs = logs.filter(log =>
        log.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (severityFilter) {
      logs = logs.filter(log => log.severity === severityFilter);
    }

    setFilteredLogs(logs);
  };

  const downloadCSV = () => {
    const csv = systemLogs.map(log => `${log.timestamp},${log.severity},${log.message}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'system_logs.csv';
    a.click();
  };

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

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await fetchUserMetrics();
      await fetchSystemLogs();
      await fetchEventsToday();
      setIsLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    handleSearchAndFilter();
  }, [searchTerm, severityFilter]);

  if (isLoading) {
    return <Spinner animation="border" />;
  }

  return (
    <div>
      <Container className="mt-5">
        <Navbar className={isDarkMode ? 'navbar-dark-mode' : 'navbar-light'} expand="lg" fixed="top">
          <Container className="navbar-container">
            <Navbar.Brand href="/">SiNoMoto</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ml-auto">
                <Nav.Link href='/admindash'>Vista general</Nav.Link>
                <Nav.Link href='/adminusers'>Usuarios</Nav.Link>
                <Nav.Link href='/admintelemetry'>Telemetria general</Nav.Link>
                <Nav.Link href='/adminsettings'>Configuración</Nav.Link>
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

        <Row className="mb-4">
          <Col md={4}>
            <WelcomeCard title="Usuarios activos" description={activeUsersCount || 0} />
          </Col>
          <Col md={4}>
            <WelcomeCard title="Eventos totales de Telemetria" description={eventsTodayCount || 0} />
          </Col>
          <Col md={4}>
            <WelcomeCard title="Logs Criticos" description={criticalLogsCount || 0} />
          </Col>
        </Row>

        <Tab.Container id="admin-dashboard-tabs" defaultActiveKey="Overview">
          <Row>
            <Col md={12}>
              <Tab.Content>
                <Tab.Pane eventKey="Overview">
                  <Row>
                    <Col md={6}>
                      <WelcomeCard
                        title="Clientes del sistema"
                        description={`Total de usuarios finales del sistema registrados: ${userCount}`}
                      >
                        <Table striped bordered hover>
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Nombre</th>
                              <th>Email</th>                              
                              <th>Opciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {userMetrics.map((metric, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{metric.name}</td>
                                <td>{metric.email || 'N/A'}</td>                                
                                <td>
                                  <Button variant="warning" size="sm">
                                    <FaKey /> Recuperar contraseña
                                  </Button>{' '}
                                  <Button variant="danger" size="sm">
                                    <FaTrash /> Desactivar
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </WelcomeCard>
                    </Col>
                    <Col md={6}>
                      <WelcomeCard
                        title="Logs del sistema"
                        description="Logs recientes del sistema"
                      >
                        <Form className="mb-3">
                          <Form.Control
                            type="text"
                            placeholder="Busca en los logs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                          <Form.Select
                            value={severityFilter}
                            onChange={(e) => setSeverityFilter(e.target.value)}
                          >
                            <option value="">Todos</option>
                            <option value="info">Info</option>
                            <option value="warning">Warning</option>
                            <option value="error">Error</option>
                          </Form.Select>
                        </Form>
                        <Table striped bordered hover>
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Hora</th>
                              <th>Severidad</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredLogs.map((log, index) => (
                              <tr key={log._id}>
                                <td>{index + 1}</td>
                                <td>{format(new Date(log.timestamp), 'MMM dd, yyyy, hh:mm a')}</td>
                                <td>
                                  <span
                                    className={`badge ${
                                      log.severity === 'error'
                                        ? 'bg-danger'
                                        : log.severity === 'warning'
                                        ? 'bg-warning'
                                        : 'bg-info'
                                    }`}
                                  >
                                    {log.severity || 'N/A'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                        <Button onClick={downloadCSV}>Exportar Logs</Button>
                      </WelcomeCard>
                    </Col>
                  </Row>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    </div>
  );
};

export default AdminDashboard;
*/
//V4
/*
import React, { useEffect, useState } from 'react';
import { FaUserCircle, FaKey, FaTrash } from 'react-icons/fa';
import { Container, Nav, Navbar, Tab, Row, Col, Dropdown, Table, Card, Form, Button, Spinner, Pagination } from 'react-bootstrap';
import axios from 'axios';
import { format } from 'date-fns';

const ITEMS_PER_PAGE = 5; // Number of items per page for pagination

const WelcomeCard = ({ title, description, children }) => (
  <Card>
    <Card.Body>
      <Card.Title>{title}</Card.Title>
      <Card.Text>{description}</Card.Text>
      {children}
    </Card.Body>
  </Card>
);

const AdminDashboard = () => {
  const [userMetrics, setUserMetrics] = useState([]);
  const [systemLogs, setSystemLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [activeUsersCount, setActiveUsersCount] = useState(0);
  const [criticalLogsCount, setCriticalLogsCount] = useState(0);
  const [eventsTodayCount, setEventsTodayCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Pagination state
  const [currentUserPage, setCurrentUserPage] = useState(1);
  const [currentLogPage, setCurrentLogPage] = useState(1);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const fetchUserMetrics = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/adminuser/clients');
      setUserMetrics(response.data || []);
      setUserCount(response.data?.length || 0);
      setActiveUsersCount(response.data?.filter(user => user.active).length || 0);
    } catch (error) {
      console.error('Error fetching user metrics:', error);
      setUserMetrics([]);
    }
  };

  const fetchSystemLogs = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/admin/systemlogs');
      const logs = response.data.logs || [];
      setSystemLogs(logs);
      setFilteredLogs(logs);
      setCriticalLogsCount(logs.filter(log => log.severity === 'error' || log.severity === 'warning').length);
    } catch (error) {
      console.error('Error fetching system logs:', error);
      setSystemLogs([]);
    }
  };

  const fetchEventsToday = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/admin/telemetry-summary');
      const todayCount = response.data.reduce((sum, event) => sum + (event.count || 0), 0);
      setEventsTodayCount(todayCount);
    } catch (error) {
      console.error('Error fetching telemetry events:', error);
    }
  };

  const handleSearchAndFilter = () => {
    let logs = systemLogs;

    if (searchTerm) {
      logs = logs.filter(log =>
        log.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (severityFilter) {
      logs = logs.filter(log => log.severity === severityFilter);
    }

    setFilteredLogs(logs);
    setCurrentLogPage(1); // Reset to the first page when filtering
  };

  const downloadCSV = () => {
    const csv = systemLogs.map(log => `${log.timestamp},${log.severity},${log.message}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'system_logs.csv';
    a.click();
  };

  const paginate = (items, currentPage) => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return items.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

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

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await fetchUserMetrics();
      await fetchSystemLogs();
      await fetchEventsToday();
      setIsLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    handleSearchAndFilter();
  }, [searchTerm, severityFilter]);

  if (isLoading) {
    return <Spinner animation="border" />;
  }

  return (
    <div>
      <Container className="mt-5">
        <Navbar className={isDarkMode ? 'navbar-dark-mode' : 'navbar-light'} expand="lg" fixed="top">
          <Container className="navbar-container">
            <Navbar.Brand href="/">SiNoMoto</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ml-auto">
                <Nav.Link href='/admindash'>Vista general</Nav.Link>
                <Nav.Link href='/adminusers'>Usuarios</Nav.Link>
                <Nav.Link href='/admintelemetry'>Telemetria general</Nav.Link>
                <Nav.Link href='/adminsettings'>Configuración</Nav.Link>
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

        <Row className="mb-4">
          <Col md={4}>
            <WelcomeCard title="Usuarios activos" description={activeUsersCount || 0} />
          </Col>
          <Col md={4}>
            <WelcomeCard title="Eventos totales de Telemetria" description={eventsTodayCount || 0} />
          </Col>
          <Col md={4}>
            <WelcomeCard title="Logs Criticos" description={criticalLogsCount || 0} />
          </Col>
        </Row>

        <Tab.Container id="admin-dashboard-tabs" defaultActiveKey="Overview">
          <Row>
            <Col md={6}>
              <WelcomeCard
                title="Clientes del sistema"
                description={`Total de usuarios finales del sistema registrados: ${userCount}`}
              >
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Opciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginate(userMetrics, currentUserPage).map((metric, index) => (
                      <tr key={index}>
                        <td>{(currentUserPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                        <td>{metric.name}</td>
                        <td>{metric.email || 'N/A'}</td>
                        <td>
                          <Button variant="warning" size="sm">
                            <FaKey /> Recuperar contraseña
                          </Button>{' '}
                          <Button variant="danger" size="sm">
                            <FaTrash /> Desactivar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <Pagination>
                  {Array.from({ length: Math.ceil(userMetrics.length / ITEMS_PER_PAGE) }, (_, i) => (
                    <Pagination.Item
                      key={i + 1}
                      active={i + 1 === currentUserPage}
                      onClick={() => setCurrentUserPage(i + 1)}
                    >
                      {i + 1}
                    </Pagination.Item>
                  ))}
                </Pagination>
              </WelcomeCard>
            </Col>
            <Col md={6}>
              <WelcomeCard
                title="Logs del sistema"
                description="Logs recientes del sistema"
              >
                <Form className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Busca en los logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Form.Select
                    value={severityFilter}
                    onChange={(e) => setSeverityFilter(e.target.value)}
                  >
                    <option value="">Todos</option>
                    <option value="info">Info</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                  </Form.Select>
                </Form>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Hora</th>
                      <th>Severidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginate(filteredLogs, currentLogPage).map((log, index) => (
                      <tr key={log._id}>
                        <td>{(currentLogPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                        <td>{format(new Date(log.timestamp), 'MMM dd, yyyy, hh:mm a')}</td>
                        <td>
                          <span
                            className={`badge ${
                              log.severity === 'error'
                                ? 'bg-danger'
                                : log.severity === 'warning'
                                ? 'bg-warning'
                                : 'bg-info'
                            }`}
                          >
                            {log.severity || 'N/A'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <Pagination>
                  {Array.from({ length: Math.ceil(filteredLogs.length / ITEMS_PER_PAGE) }, (_, i) => (
                    <Pagination.Item
                      key={i + 1}
                      active={i + 1 === currentLogPage}
                      onClick={() => setCurrentLogPage(i + 1)}
                    >
                      {i + 1}
                    </Pagination.Item>
                  ))}
                </Pagination>
                <Button onClick={downloadCSV}>Exportar Logs</Button>
              </WelcomeCard>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    </div>
  );
};

export default AdminDashboard;
*/
//V5
import React, { useEffect, useState } from 'react';
import { FaUserCircle, FaKey, FaTrash } from 'react-icons/fa';
import { Container, Nav, Navbar, Tab, Row, Col, Dropdown, Table, Card, Form, Button, Spinner, Pagination, Modal } from 'react-bootstrap';
import axios from 'axios';
import { format } from 'date-fns';

const ITEMS_PER_PAGE = 5;

const WelcomeCard = ({ title, description, children }) => (
  <Card>
    <Card.Body>
      <Card.Title>{title}</Card.Title>
      <Card.Text>{description}</Card.Text>
      {children}
    </Card.Body>
  </Card>
);

const AdminDashboard = () => {
  const [userMetrics, setUserMetrics] = useState([]);
  const [systemLogs, setSystemLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [activeUsersCount, setActiveUsersCount] = useState(0);
  const [criticalLogsCount, setCriticalLogsCount] = useState(0);
  const [eventsTodayCount, setEventsTodayCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [currentUserPage, setCurrentUserPage] = useState(1);
  const [currentLogPage, setCurrentLogPage] = useState(1);

  // Modal State
  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const fetchUserMetrics = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/adminuser/clients');
      setUserMetrics(response.data || []);
      setUserCount(response.data?.length || 0);
      setActiveUsersCount(response.data?.filter(user => user.active).length || 0);
    } catch (error) {
      console.error('Error fetching user metrics:', error);
      setUserMetrics([]);
    }
  };

  const fetchSystemLogs = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/admin/systemlogs');
      const logs = response.data.logs || [];
      setSystemLogs(logs);
      setFilteredLogs(logs);
      setCriticalLogsCount(logs.filter(log => log.severity === 'error' || log.severity === 'warning').length);
    } catch (error) {
      console.error('Error fetching system logs:', error);
      setSystemLogs([]);
    }
  };

  const fetchEventsToday = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/admin/telemetry-summary');
      const todayCount = response.data.reduce((sum, event) => sum + (event.count || 0), 0);
      setEventsTodayCount(todayCount);
    } catch (error) {
      console.error('Error fetching telemetry events:', error);
    }
  };

  const handleSearchAndFilter = () => {
    let logs = systemLogs;

    if (searchTerm) {
      logs = logs.filter(log =>
        log.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (severityFilter) {
      logs = logs.filter(log => log.severity === severityFilter);
    }

    setFilteredLogs(logs);
    setCurrentLogPage(1);
  };

  const paginate = (items, currentPage) => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return items.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  const openLogModal = (log) => {
    setSelectedLog(log);
    setShowLogModal(true);
  };

  const closeLogModal = () => {
    setSelectedLog(null);
    setShowLogModal(false);
  };

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

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await fetchUserMetrics();
      await fetchSystemLogs();
      await fetchEventsToday();
      setIsLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    handleSearchAndFilter();
  }, [searchTerm, severityFilter]);

  if (isLoading) {
    return <Spinner animation="border" />;
  }

  return (
    <div>
      <Container className="mt-5">
        {/* Navbar */}
        <Navbar className={isDarkMode ? 'navbar-dark-mode' : 'navbar-light'} expand="lg" fixed="top">
          <Container className="navbar-container">
            <Navbar.Brand href="/">SiNoMoto</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ml-auto">
                <Nav.Link href='/admindash'>Vista general</Nav.Link>
                <Nav.Link href='/adminusers'>Usuarios</Nav.Link>
                <Nav.Link href='/admintelemetry'>Telemetria general</Nav.Link>
                <Nav.Link href='/adminsettings'>Configuración</Nav.Link>
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

        {/* Cards */}
        <Row className="mb-4">
          <Col md={4}>
            <WelcomeCard title="Usuarios activos" description={activeUsersCount || 0} />
          </Col>
          <Col md={4}>
            <WelcomeCard title="Eventos totales de Telemetria" description={eventsTodayCount || 0} />
          </Col>
          <Col md={4}>
            <WelcomeCard title="Logs Criticos" description={criticalLogsCount || 0} />
          </Col>
        </Row>

        <Tab.Container id="admin-dashboard-tabs" defaultActiveKey="Overview">
        <Row>
  {/* User Metrics */}
  <Col md={6}>
    <WelcomeCard
      title="Clientes del sistema"
      description={`Total de usuarios finales del sistema registrados: ${userCount}`}
    >
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {paginate(userMetrics, currentUserPage).map((user, index) => (
            <tr key={user._id}>
              <td>{(currentUserPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
              <td>{user.name}</td>
              <td>{user.email || 'N/A'}</td>
              <td>
                <Button variant="warning" size="sm">
                  <FaKey /> Recuperar contraseña
                </Button>{' '}
                <Button variant="danger" size="sm">
                  <FaTrash /> Desactivar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination>
        {Array.from({ length: Math.ceil(userMetrics.length / ITEMS_PER_PAGE) }, (_, i) => (
          <Pagination.Item
            key={i + 1}
            active={i + 1 === currentUserPage}
            onClick={() => setCurrentUserPage(i + 1)}
          >
            {i + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </WelcomeCard>
  </Col>

  {/* System Logs */}
  <Col md={6}>
    <WelcomeCard title="Logs del sistema" description="Logs recientes del sistema">
      <Form className="mb-3">
        <Form.Control
          type="text"
          placeholder="Busca en los logs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Form.Select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
        >
          <option value="">Todos</option>
          <option value="info">Info</option>
          <option value="warning">Warning</option>
          <option value="error">Error</option>
        </Form.Select>
      </Form>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Hora</th>
            <th>Severidad</th>
          </tr>
        </thead>
        <tbody>
          {paginate(filteredLogs, currentLogPage).map((log, index) => (
            <tr key={log._id} onClick={() => openLogModal(log)}>
              <td>{(currentLogPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
              <td>{format(new Date(log.timestamp), 'MMM dd, yyyy, hh:mm a')}</td>
              <td>
                <span
                  className={`badge ${
                    log.severity === 'error'
                      ? 'bg-danger'
                      : log.severity === 'warning'
                      ? 'bg-warning'
                      : 'bg-info'
                  }`}
                >
                  {log.severity || 'N/A'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination>
        {Array.from({ length: Math.ceil(filteredLogs.length / ITEMS_PER_PAGE) }, (_, i) => (
          <Pagination.Item
            key={i + 1}
            active={i + 1 === currentLogPage}
            onClick={() => setCurrentLogPage(i + 1)}
          >
            {i + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </WelcomeCard>
  </Col>
</Row>
        </Tab.Container>
      </Container>

      {/* Log Modal */}
      <Modal show={showLogModal} onHide={closeLogModal}>
        <Modal.Header closeButton>
          <Modal.Title>Detalles del Log</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedLog && (
            <div>
              <p><strong>Hora:</strong> {format(new Date(selectedLog.timestamp), 'MMM dd, yyyy, hh:mm a')}</p>
              <p><strong>Severidad:</strong> {selectedLog.severity}</p>
              <p><strong>Mensaje:</strong> {selectedLog.message}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeLogModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
