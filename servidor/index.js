const mongoose = require('mongoose')
const app = express()
const cors = require('cors')

app.use(cors());
app.use(express.json());

//mongoose.connect("")

app.listen(3001, ()=>{
    console.log("Servidor funcionando")
})