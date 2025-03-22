import React, { useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';
import axios from 'axios';

const MaintenanceBanner = () => {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/settings`);
        setIsMaintenanceMode(response.data.maintenanceMode || false);
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    fetchSettings();
  }, []);

  if (!isMaintenanceMode) return null;

  return (
    <Alert variant="warning" className="text-center">
      🚧 El sistema esta en mantenimiento. Sorry. 🚧
    </Alert>
  );
};

export default MaintenanceBanner;
