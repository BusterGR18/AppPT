const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required : true,
        trim: true
    },
    email: {
        type: String,
        required : true,
        trim: true
    },
    iddispositivo:{
        type: String,
        required: true,
        trim: true
    },
    numtel: {
        type: String,
        required: true,
    },
    usertype: { 
        type: String, 
        enum: ['client', 'admin'], default: 'client'
    },
    tiposangre: {
        type: String
    },
    password: {
        type: String,
        required : true
    }
})

module.exports = mongoose.model('users', userSchema)