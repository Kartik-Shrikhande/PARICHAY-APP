const express = require("express");
const router = express.Router();
const userProfileController = require("../controllers/user.Controller")
// const utility = require("../controllers/otp.Controller")
const Middleware= require("../middleware/middleware")
const userValidation = require("../validations/validations");


router.post('/signup', userValidation.userValidationRules(),userProfileController.userSignup)
router.post('/login', userProfileController.userlogin)
// router.post('/forget', utility.sendEmailVerificationOTP)


// //otp
// router.post('/forgot-password',utility.forgetPassword)
// router.post('/forgot-password/verify-otp',utility.verifyOtpForForgetPassword)
// router.post('/verify-otp', utility.verifyOtp)



router.use(Middleware.authentication)

// router.post('/profile', userProfileController.CreateUserProfile)
router.get('/users', userProfileController.getAllUsers)
router.get('/user', userProfileController.getUser)
router.put('/update', userProfileController.updateUserProfile)
router.delete('/delete', userProfileController.deleteUser)
router.post('/reset', userProfileController.resetPassword)


module.exports=router;