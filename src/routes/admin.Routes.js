const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.Controller")
const Middleware= require("../middleware/middleware")

router.post('/signup', adminController.AdminSignup)
router.post('/login', adminController.login)
router.delete('/delete/:userId', adminController.deleteUserById)
// router.use(Middleware.authentication)


module.exports=router;