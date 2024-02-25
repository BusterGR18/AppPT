/*const express = require ('express')
const mongoose = require('mongoose')
const app = express()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const connectDB = require('./db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

app.use(cors());
app.use(express.json());
// Define authentication routes
app.use('/auth', authRoutes);

// Define user routes
app.use('/user', userRoutes);



const PORT = process.env.PORT || 3900;

// Conexion a MongoDB
connectDB();
app.use(express.json());



app.listen(PORT, ()=>{
    console.log('Servidor funcionando en', PORT)
})

*/
const express = require('express');
const connectDB = require('./db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

const app = express();
const PORT = process.env.PORT || 3900;

// Connect to MongoDB
connectDB();

// Parse JSON request body
app.use(express.json());

// Define authentication routes
app.use('/auth', authRoutes);

// Define user routes
app.use('/user', userRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});