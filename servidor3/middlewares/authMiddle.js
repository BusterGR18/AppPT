//V1
/*const jwt = require('jsonwebtoken')
require('dotenv').config()

//auth, isSTudent, isAdmin


exports.auth = (req,res,next)=>{
    try {
        //extract JWT token
        const token = req.body.token || req.cookies.token
        if(!token){
            return res.status(401).json({
                success: false,
                message: "Token Missing"
            })
        }

        //verify the token
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET)
            req.user = decode
            console.log(req.user)
        } catch (error) {
            return res.status(401).json({
                success:false,
                message: "invalid Token ⚠️"
            })
        }

        next()

    } catch (error) {
        return res.status(401).json({
            success:false,
            message: "Error Occured in Authentication ⚠️"
        })
    }
}

exports.isClient = (req,res,next)=>{
    try {
        console.log(req.user)
        if(req.user.role !=="client"){
            return res.status(401).json({
                success:false,
                message: "You are not a client⚠️"
            })
        }

        next()
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: "An error occured⚠️: "+error
        })
    }
}

exports.isAdmin = (req,res,next)=>{
    try {
        if(req.user.role !=="Admin"){
            return res.status(401).json({
                success:false,
                message: "You are not an authorized Admin⚠️"
            })
        }

        next()
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: "An error occured⚠️: "+error
        })
    }
}
*/
//V2
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.auth = (req, res, next) => {
    try {
        // Extract JWT token from Authorization header, body, or cookies
        const token = 
            req.headers.authorization?.split(' ')[1] || // Bearer <token>
            req.body.token ||
            req.cookies.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token Missing"
            });
        }

        // Verify the token
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decode; // Attach the decoded payload to `req.user`
            //console.log('Decoded User:', req.user); // Debug log
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Invalid Token ⚠️"
            });
        }

        next(); // Move to the next middleware
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Error Occurred in Authentication ⚠️"
        });
    }
};

exports.isClient = (req, res, next) => {
    try {
        //console.log('Client Middleware User:', req.user); // Debug log
        if (req.user.role !== "client") {
            return res.status(401).json({
                success: false,
                message: "You are not a client⚠️"
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occurred⚠️: " + error.message
        });
    }
};

exports.isAdmin = (req, res, next) => {
    try {
        console.log('Admin Middleware User:', req.user); // Debug log
        if (req.user.role !== "admin") { // Ensure consistent casing for "admin"
            return res.status(401).json({
                success: false,
                message: "You are not an authorized Admin⚠️"
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "An error occurred⚠️: " + error.message
        });
    }
};
