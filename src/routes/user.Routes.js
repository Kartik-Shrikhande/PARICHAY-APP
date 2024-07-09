const express = require("express")
const router = express.Router()
const userController = require("../controllers/user.Controller")
const Middleware = require("../middleware/middleware")
const userValidation = require("../validations/validations")
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })


router.post('/signup', upload.fields([{ name: "photographs" }]), userValidation.userValidationRules(), userController.userSignup)
router.post('/login', userController.userlogin)
router.use(Middleware.authentication)
router.get('/users', userController.getAllUsers)
router.get('/user', userController.getUser)
router.put('/update', upload.fields([{ name: "photographs" }]), userController.updateUserProfile)
router.delete('/delete', userController.deleteUser)
router.post('/update-password', userController.updatePassword)
router.get('/prices', userController.pricesList)
router.post('/subscription', userController.subscription)
router.get('/user-events', userController.getAllEvents);
router.get('/members', userController.getCommunityMembers)


module.exports = router;