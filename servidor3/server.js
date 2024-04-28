const express = require('express')
const cors = require('cors');
const app = express()

require('dotenv').config()
const PORT = process.env.PORT || 4000


app.use(express.json())


//calling Database function
require('./config/database').connect()

//route importing and mounting
const user = require('./routes/user')

const corsOptions = {
    origin: 'http://localhost:3000',
};
  
app.use(cors(corsOptions));

app.use('/api/v1', user)


app.listen(PORT, ()=>{
    console.log("Server Started")
   
})