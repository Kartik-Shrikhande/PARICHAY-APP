const express = require("express")
const router = express.Router()
const adminController = require("../controllers/admin.Controller")
const communityController = require("../controllers/communityController")
const Middleware = require("../middleware/middleware")
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })


router.post('/signup', adminController.AdminSignup)
router.post('/login', adminController.adminLogin)
router.use(Middleware.authentication, Middleware.authorization)


////////////////////////////EVENTS///////////////////////////////
router.post('/create-event', upload.fields([{ name: "eventPhotograph" }]), adminController.createEvent)
router.put('/update-event/:id', upload.fields([{ name: "eventPhotograph" }]), adminController.updateEvent)
router.delete('/delete/:id', adminController.deleteEvent)
router.get('/all-events', adminController.getAllEvents)
router.get('/event/:id', adminController.getEventById)


///////////////////////admin-users////////////////////////////
router.post('/create-user', adminController.adminCreateUser)
router.put('/update-user/:id', upload.fields([{ name: "photographs" }]), adminController.adminUpdateUser)
router.get('/users', adminController.adminGetAllUsers)
router.get('/user/:id', adminController.adminGetUserById)
router.delete('/user-delete/:id', adminController.deleteUserById)


//////////////////////community Members //////////////////////
router.post('/create-member', upload.fields([{ name: "photograph" }]), communityController.createCommunityMember)
router.put('/update-member/:id', upload.fields([{ name: "photograph" }]), communityController.updateCommunityMember)
router.delete('/delete-member/:id', communityController.deleteCommunityMember)
router.get('/members', communityController.getCommunityMembers)


module.exports = router;