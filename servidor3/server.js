//V2
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
  console.log('Running scheduled statistics update...');
  await updateStatistics();
  historicalDataController.saveDailySnapshot();
}, {
  timezone: 'America/Mexico_City' // Adjust timezone to GMT-6
});

// Start the scheduled task (optional, as `cron.schedule` starts it by default)
scheduledTask.start();
console.log('Cron job scheduled to update statistics daily at 00:00 GMT-6');

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

// Route importing and mounting
const contactRoutes = require('./routes/contactRoutes');
const userRoutes = require('./routes/user');
const geoJSONRoutes = require('./routes/geoJSONRoutes');
const telemetryRoutes = require('./routes/telemetryRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const adminuserRoutes = require('./routes/adminuserRoutes');
const guestProfilesRouter = require('./routes/guestProfiles');
const accidentRoutes = require('./routes/accidentsRouter');
const statisticsRoutes = require('./routes/statisticsRoutes');
const historicalDataRouter = require('./routes/historicalDataRouter');

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


//app.use('/api/accidents', accidentRoutes);


app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
