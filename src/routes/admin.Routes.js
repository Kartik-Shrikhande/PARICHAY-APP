const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.Controller")
// const Middleware= require("../middleware/middleware")

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage:storage});

// router.post('/signup', adminController.AdminSignup)
router.post('/login', adminController.adminLogin)

router.post('/create-event',upload.fields([
    { name:"eventPhotograph"}
    ]), adminController.createEvent)


    router.put('/update-event/:id',upload.fields([
        { name:"eventPhotograph"}
        ]), adminController.updateEvent)

router.delete('/delete/:id', adminController.deleteEvent)
router.get('/events',adminController.getAllEvents);
router.get('/event/:id',adminController.getEventById);


router.delete('/delete/:userId', adminController.deleteUserById)

// router.use(Middleware.authentication)


module.exports=router;