const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController');
//Handlers from controllers
const {login, signup, sendotp} = require("../controllers/auth")
const {auth, isClient, isAdmin} = require('../middlewares/authMiddle')

router.post('/login', login)    
router.post('/signup', signup)
//router.post('/sendotp', sendotp)


//testing protected route
router.get("/test",auth, (req,res)=>{
    res.json({
        success: true,
        message: "You are a valid Tester 👨‍💻"
    })
})
//protected routes
/*
router.get('/student', auth, isStudent, (req,res)=>{
    res.json({
        success: true,
        message: "You are a valid Student 🧑‍🎓"
    })
})
*/
router.get('/dash', auth, isClient, (req,res)=>{
    res.json({
        success: true,
        message: "Bienvendio al panel de usuario"
    })
})

router.get('/admin', auth, isAdmin, (req,res)=>{
    res.json({
        success: true,
        message: "You are a valid Admin 😎"
    })
})



// Update user information
router.put('/users/update', auth, isClient, userController.updateUserDetails);
// Get user info
router.get('/users/details', auth, isClient, userController.getUserDetails);
module.exports = router