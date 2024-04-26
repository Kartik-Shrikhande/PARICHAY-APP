const express = require("express");
const router = express.Router();
const otpController = require("../controllers/otp.Controller")
const Middleware = require("../middleware/middleware")


router.post('/otp', otpController.otpSent)
router.post('/verify',otpController.verifyOTP)
router.put('/new-password', otpController.resetPassword)


module.exports = router;