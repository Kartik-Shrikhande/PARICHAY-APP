const jwt = require('jsonwebtoken')
require('dotenv').config({ path: '.env' })
const adminModel = require("../models/admin.Model");
require('dotenv').config({ path: '.env' })



//-------------------------------authentication------------------------------------//

const authentication = async (req, res, next) => {
    try {
        let token = req.headers.authorization
        if (!token) return res.status(400).json({ status: false, message: 'token is not present' })
        //Removing 'Bearer' word from token
        token = token.split(' ')[1]
        //Verifying the token using the SECRET_KEY 
        jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
            if (err) return res.status(401).json({ status: false, message: err.message })
            else {
                //setting userId in the request object 
                req.adminId = decodedToken.adminId
                next()
            }
        })
    }
    catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }
}




//-------------------------------authorization------------------------------------//

const authorization = async (req, res, next) => {
    try {
        // Extract token from Authorization header
        const token = req.header('Authorization')?.replace('Bearer ', '')
        if (!token) return res.status(401).send({ status: false, message: "Access denied. No token provided." })

        // Verify token and extract adminId
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        const adminId = decoded.adminId // Assuming the token contains a 'userId' field representing adminId

        // Checking for valid adminId
        if (!adminId) return res.status(400).send({ status: false, message: "Invalid AdminId" })

        // Check if the provided adminId exists
        const checkAdminId = await adminModel.findById(adminId)
        if (!checkAdminId) return res.status(404).send({ status: false, message: "AdminId Does Not Exist" })

        // Assuming req.adminId is the ID of the user performing the action (possibly extracted from the token)
        // If this is the logic to ensure only the admin can perform the action, you might need to compare req.adminId and adminId
        if (adminId !== req.adminId) return res.status(403).send({ status: false, message: "Unauthorized User" })
        req.adminId = adminId// Attach adminId to the request object for further use in the request pipeline
        next()
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}




//----------------------------------------------------------------------//


module.exports = {
    authentication,
    authorization
}