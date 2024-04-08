const express = require("express");
const router = express.Router();
const userProfileController = require("../controllers/user.Controller")
// const utility = require("../controllers/otp.Controller")
const Middleware= require("../middleware/middleware")
const userValidation = require("../validations/validations");

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage:storage});


router.post('/signup',upload.fields([
    { name:"photograph", maxCount:1}
    ]), 
    userValidation.userValidationRules(),userProfileController.userSignup)

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

router.put('/update',upload.fields([
    { name:"photograph", maxCount:1}
    ]), userProfileController.updateUserProfile)
    
router.delete('/delete', userProfileController.deleteUser)
router.post('/reset', userProfileController.resetPassword)
router.get('/prices',userProfileController.pricesList)
router.post('/subscription',userProfileController.subscription)

module.exports=router;