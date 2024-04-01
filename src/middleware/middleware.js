const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config({path:'.env'})


const authentication = async (req, res, next) => {
    try {
        let token = req.headers.authorization
        if (!token) return res.status(400).send({ status: false, message: 'token is not present' })
        //Removing 'Bearer' word from token
        token = token.split(' ')[1]
        //Verifying the token using the SECRET_KEY 
        jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
            if (err) return res.status(401).send({ status: false, message: err.message })
            else {
                //setting userId in the request object 
                req.userId = decodedToken.userId
                next()
            }
        })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

// const authorisation = async (req, res, next) => {
//     try {
//         let userId = req.params.userId
//         //checking for valid author Id
//         if (!userId) return res.status(400).send({ status: false, message: "Invalid UserId" })
//         let checkAuthorId = await authorModel.findById(userId)
//         //checking if provided AuthorId exist or not
//         if (!checkAuthorId) return res.status(404).send({ status: false, message: "UserId Does Not Exist" })
//         //checking autherization of user
//         if (userId != req.userId) return res.status(403).send({ status: false, message: "Unauthorised User" })
//         next()
//     } catch (error) {
//         return res.status(500).send({ status: false, message: error.message })
//     }
// }
module.exports = { authentication,
// authorisation    
}