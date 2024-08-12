/*const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express()

require('dotenv').config()
const PORT = process.env.PORT || 4000


app.use(express.json())


//calling Database function
require('./config/database').connect()

//route importing and mounting
const contactRoutes = require('./routes/contactosrutas');
const user = require('./routes/user')

const corsOptions = {
    origin: 'http://localhost:3000',
};
  
app.use(cors(corsOptions));

app.use('/api/v1', user)
app.use(bodyParser.json());
app.use('/api/contacts', contactRoutes);


app.listen(PORT, ()=>{
    console.log("Server Started")
   
})
*/
//V2
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

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
const adminuserRoutes = require('./routes/adminuserRoutes')



app.use('/api/v1', userRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/geojson', geoJSONRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/telemetry', telemetryRoutes); 
app.use('/api/adminuser', adminuserRoutes);


app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
