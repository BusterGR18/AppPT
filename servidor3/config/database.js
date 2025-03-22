//V1
/*
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
    */
//V2
const mongoose = require('mongoose');
const logger = require('../extras/logger');

require('dotenv').config();

exports.connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        logger.info("DB Connected Successfully ✅");

        // Handle disconnection events
        mongoose.connection.on('disconnected', () => {
            logger.warning("[DB] Disconnected! Retrying...");
        });

        mongoose.connection.on('reconnected', () => {
            logger.info("[DB] Reconnected successfully!");
        });

        mongoose.connection.on('error', (err) => {
            logger.error("[DB ERROR] " + err);
        });

    } catch (error) {
        logger.error("DB Connection Error: " + error);
        process.exit(1);
    }
};
