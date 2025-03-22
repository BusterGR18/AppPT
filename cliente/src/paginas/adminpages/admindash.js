
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
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/adminuser/clients`);
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
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/systemlogs`);
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
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/telemetry-summary`);
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
