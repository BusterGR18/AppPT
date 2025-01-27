//V2
const logger = require('./extras/logger');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
//scheduling task
const cron = require('node-cron');
const { updateStatistics } = require('./extras/statisticsService');
const historicalDataController = require('./controllers/historicalDataController');

// Schedule the cron job to run daily at 00:00 GMT-6
const scheduledTask = cron.schedule('0 0 * * *', async () => {
  logger.info('Running scheduled statistics update...');
  await updateStatistics();
  historicalDataController.saveDailySnapshot();
}, {
  timezone: 'America/Mexico_City' // Adjust timezone to GMT-6
});

// Start the scheduled task (optional, as `cron.schedule` starts it by default)
scheduledTask.start();
logger.info('Cron job scheduled to update statistics daily at 00:00 GMT-6');

require('dotenv').config();
const PORT = process.env.PORT || 4000;

app.use(express.json());

const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
};

app.use(cors(corsOptions));                     
app.options('*', cors(corsOptions)); 

app.use(bodyParser.json());

// Calling Database function
require('./config/database').connect();
//Accident listener
require('./extras/accidentlistener'); 
require('./extras/userIncidentsListener');
const { initTelemetryListener } = require('./extras/telemetryListener'); // Adjust the path as needed
initTelemetryListener();

// Route importing and mounting
const contactRoutes = require('./routes/contactRoutes');
const userRoutes = require('./routes/user');
const geoJSONRoutes = require('./routes/geoJSONRoutes');
const telemetryRoutes = require('./routes/telemetryRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const adminuserRoutes = require('./routes/adminuserRoutes');
const guestProfilesRouter = require('./routes/guestProfiles');
const statisticsRoutes = require('./routes/statisticsRoutes');
const historicalDataRouter = require('./routes/historicalDataRouter');
const accidentRoutes = require('./routes/accidentRoutes');
const boardRoutes = require('./routes/boardRoutes');
//Admin side apis
const adminRoutes= require('./routes/adminRoutes');
const adminsettingsRoutes= require('./routes/adminsettingsRoutes');
//Additional functionalities

//endpoints definition
app.use('/api/v1', userRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/geojson', geoJSONRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/telemetry', telemetryRoutes); 
app.use('/api/adminuser', adminuserRoutes);
app.use('/api/guest-profiles', guestProfilesRouter);
app.use('/api/statistics', statisticsRoutes);
app.use('/api/historical-data', historicalDataRouter);
app.use('/api/accidents', accidentRoutes);
app.use('/api/boards', boardRoutes);

const notificationRoutes = require('./routes/notificationRoutes');
const userIncidentRoutes = require('./routes/userIncidentRoutes');
const checkNotifications = require('./middlewares/checkNotifications');

app.use('/api/notifications', notificationRoutes);
app.use('/api/notifications/user', userIncidentRoutes);


//admin related apis
app.use('/api/admin', adminRoutes);
app.use('/api/admin/settings', adminsettingsRoutes);

const checkMaintenance = require('./middlewares/checkMaintenance');
app.use(checkMaintenance);

const { publishAllGeoTypeData } = require('./extras/geoTypePublisher');
// Schedule publishing all GeoType data every hour
cron.schedule('0 * * * *', () => {
  logger.info('[GeoJSON]Running scheduled GeoType publish...');
  publishAllGeoTypeData();
});
//const { watchGeoTypeChanges } = require('./extras/geoTypeChangeListener');

//Start watching for GeoType changes
//watchGeoTypeChanges();

//const { publishAllGeoTypeData } = require('./extras/geoTypePublisher');

// Temporary route for testing GeoType publishing
app.get('/test-publish-geoTypes', async (req, res) => {
  try {
    console.log('Manually triggering GeoType publishing...');
    await publishAllGeoTypeData(); // Trigger the publishing
    res.status(200).json({ message: 'GeoTypes published successfully.' });
  } catch (error) {
    console.error('Error publishing GeoTypes:', error);
    res.status(500).json({ message: 'Error publishing GeoTypes', error });
  }
});

const { publishGeoTypeForUser } = require('./extras/geoTypePublisher');

// Add a test route to trigger publishing for a specific user
app.get('/api/test/publish-geoType/:userEmail', async (req, res) => {
  const { userEmail } = req.params;
  try {
    await publishGeoTypeForUser(userEmail);
    res.status(200).send(`GeoType data for ${userEmail} published to MQTT.`);
  } catch (error) {
    console.error(`Error publishing GeoType data for ${userEmail}:`, error);
    res.status(500).send('Error publishing GeoType data.');
  }
});

app.listen(PORT, () => {
    //console.log(`Server started on port ${PORT}`);
    logger.info(`Server started on port ${PORT}`);
});

app.use((req, res, next) => {
  //console.log(`Request URL: ${req.url}, Method: ${req.method}`);
  logger.info(`Request URL: ${req.url}, Method: ${req.method}`);
  next();
});
