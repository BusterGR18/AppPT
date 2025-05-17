

// const bcrypt = require('bcrypt')
// const user = require("../models/user")
// const jwt= require('jsonwebtoken')
// require('dotenv').config()
// //signup handle
// exports.signup = async(req, res)=> {
//     try {
//         //get input data
//         const {name, email, password, iddispositivo, numtel, tiposangre, role}= req.body
//         //check if use already exists?
//         const existingUser = await user.findOne({email})
//         if(existingUser){
//             return res.status(400).json({
//                 success: false,
//                 message: "User already exists"
//             })
//         }

//         //secure password
//         let hashedPassword
//         try {
//             hashedPassword = await bcrypt.hash(password,10)
//         } catch (error) {
//             return res.status(500).json({
//                 success: false,
//                 message : `Hashing pasword error for ${password}: `+error.message
//             })
//         }

//         const User = await user.create({
//             name, email, iddispositivo, numtel, tiposangre, password:hashedPassword, role
//         })

//         return res.status(200).json({
//             success: true,
//             message: "user created successfully ✅"
//         })
//     } catch (error) {
//         console.error(error)
//         return res.status(500).json({
//             success: false,
//             message : "User registration failed"
//         })
//     }
// }


// exports.login = async(req, res)=> {

//     try {
//         //data fetch
//         const {email, password} = req.body
//         //validation on email and password
//         if(!email || !password){
//             return res.status(400).json({
//                 success:false,
//                 message: "Plz fill all the details carefully"
//             })
//         }

//         //check for registered User
//         let User= await  user.findOne({email})
//         //if user not registered or not found in database
//         if(!User){
//             return res.status(401).json({
//                 success: false,
//                 message: "You have to Signup First"
//             })
//         }

//         const payload ={
//             email: User.email,
//             id: User._id,
//             role: User.usertype,
//         }
//         //verify password and generate a JWt token 🔎
//         if(await bcrypt.compare(password,User.password)){
//             //if password matched
//              //now lets create a JWT token
//              let token = jwt.sign(payload, 
//                         process.env.JWT_SECRET,
//                         {expiresIn: "2h"}
//                         )
//             User = User.toObject()
//             User.token = token

//             User.password = undefined
//             const options = {
//                 expires: new Date( Date.now()+ 3*24*60*60*1000),
//                 httpOnly: true  //It will make cookie not accessible on clinet side -> good way to keep hackers away

//             }
//             console.log("Login successful for user:", User.email);
//             res.cookie(
//                 "token",
//                 token,
//                 options
//             ).status(200).json({
//                 success: true,
//                 token,
//                 User,
//                 message: "Logged in Successfully✅"

//             })

//         }else{
//             //password donot matched
//             return res.status(403).json({
//                 success: false,
//                 message: "Password incorrects⚠️"
//             })
//         }

//     } catch (error) {
//         console.error(error)
//         res.status(500).json({
//             success: false,
//             message: "Login failure⚠️ :" + error
//         })
//     }

// }



const bcrypt = require('bcrypt')
const user = require("../models/user")
const axios = require('axios');
const jwt= require('jsonwebtoken')
const mongoose = require('mongoose');

require('dotenv').config()
//signup handle
exports.signup = async(req, res)=> {
    try {
        //get input data
        const {name, email, password, iddispositivo, numtel, tiposangre, role}= req.body
        //check if use already exists?
        const existingUser = await user.findOne({email})
        if(existingUser){
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }

        //secure password
        let hashedPassword
        try {
            hashedPassword = await bcrypt.hash(password,10)
        } catch (error) {
            return res.status(500).json({
                success: false,
                message : `Hashing pasword error for ${password}: `+error.message
            })
        }

        const User = await user.create({
            name, email, iddispositivo, numtel, tiposangre, password:hashedPassword, role
        })

// 🔽 Create UserSettings after user creation
const UserSettings = mongoose.models.UserSettings || require('../models/userSettings');
await UserSettings.create({
  username: email,
  settings: {
    enableStatistics: true,
    enableGuestMode: false,
    enableCustomNotificationMessage: false,
    customNotificationMessage: "Bienvenido a SiNoMoto",
    notifications: {
      whatsapp: false,
      sms: true,
      telegram: false
    },
    selectedGuestProfile: null, // ✅ explicitly null to avoid ObjectId cast error
    displayStatistics: [
      "totalRideDuration",
      "guestModeStats",
      "averageSpeed",
      "distanceTraveled",
      "accidentCount",
      "maxSpeed",
      "topLocations"
    ],
    guestModeLogs: [],
    excludedContacts: []
  }
});

            try {
      await axios.post('http://mailer:6000/send', {
        to: email,
        subject: "¡Bienvenido a SiNoMoto!",
        template_key: "register",
        variables: {
          nomuser: name
        }
      });
      console.log(`Welcome email sent to ${email}`);
    } catch (err) {
      console.error(`Failed to send welcome email: ${err.message}`);
    }


        return res.status(200).json({
            success: true,
            message: "user created successfully ✅"
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message : "User registration failed"
        })
    }
}


exports.login = async(req, res)=> {

    try {
        //data fetch
        const {email, password} = req.body
        //validation on email and password
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message: "Plz fill all the details carefully"
            })
        }

        //check for registered User
        let User= await  user.findOne({email})
        //if user not registered or not found in database
        if(!User){
            return res.status(401).json({
                success: false,
                message: "You have to Signup First"
            })
        }

        const payload ={
            email: User.email,
            id: User._id,
            role: User.usertype,
        }
        //verify password and generate a JWt token 🔎
        if(await bcrypt.compare(password,User.password)){
            //if password matched
             //now lets create a JWT token
             let token = jwt.sign(payload, 
                        process.env.JWT_SECRET,
                        {expiresIn: "2h"}
                        )
            User = User.toObject()
            User.token = token

            User.password = undefined
            const options = {
                expires: new Date( Date.now()+ 3*24*60*60*1000),
                httpOnly: true  //It will make cookie not accessible on clinet side -> good way to keep hackers away

            }
            console.log("Login successful for user:", User.email);
            res.cookie(
                "token",
                token,
                options
            ).status(200).json({
                success: true,
                token,
                User,
                message: "Logged in Successfully✅"

            })

        }else{
            //password donot matched
            return res.status(403).json({
                success: false,
                message: "Password incorrects⚠️"
            })
        }

    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: "Login failure⚠️ :" + error
        })
    }

}