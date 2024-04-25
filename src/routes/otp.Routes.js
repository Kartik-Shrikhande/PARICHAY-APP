const express = require("express");
const router = express.Router();
const otpController = require("../controllers/otp.Controller")
const Middleware = require("../middleware/middleware")

router.use(Middleware.authentication)
router.post('/otp', otpController.otpSent)
router.put('/new-password', otpController.setNewPassword)


module.exports = router;