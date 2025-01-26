const  mongoose = require('mongoose')
const logger = require('../extras/logger');

require('dotenv').config()

exports.connect = () => {
    mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology : true
    }).then(()=>logger.info("DB Connected Successfully✅"))
    .catch((error)=>{ 
        logger.error("this error occured"+ error)
        process.exit(1)
    })
}