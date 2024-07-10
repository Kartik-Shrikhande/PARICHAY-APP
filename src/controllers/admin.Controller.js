const eventModel = require("../models/event.model")
const adminModel = require("../models/admin.Model");
const userModel = require('../models/user.Model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config({ path: '.env' })
const cloudinary = require('../.config/cloudinary')
require('dotenv').config({ path: '.env' })



//-------------------------------admin signup----------------------------------//

const AdminSignup = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email) return res.status(400).send({ status: false, message: 'Email is Required' })
        if (!password) return res.status(400).send({ status: false, message: 'Password is Required' })
        let passLength = password.length
        if (passLength < 8 || passLength > 14) return res.status(400).json({ status: false, message: 'Password must be between 8 and 14 characters long' })
        const findMail = await adminModel.findOne({ email, email })
        if (findMail) return res.status(400).send({ staus: false, message: 'Admin already exist with entered Email' })
        const hashedPassword = await bcrypt.hash(password, 10)
        const admin = await adminModel.create({ email, password: hashedPassword })

        jwt.sign({ adminId: admin._id }, process.env.SECRET_KEY, (err, token) => {
            if (err) return res.status(401).send(err.message)
            res.header('token', token)
            return res.status(201).send({ status: true, messsage: 'Admin created successfully', data: admin, token: token })
        })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}




//-------------------------------admin login----------------------------------//

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        if (Object.keys(req.body).length == 0) return res.status(400).json({ status: false, message: "Enter Required Data: Email and Password" })
        if (!email) return res.status(400).json({ status: false, message: "Enter Email" })
        if (!password) return res.status(400).json({ status: false, message: "Enter password" })
        //checking if email already exist 
        const login = await adminModel.findOne({ email: email, type: 'Admin' })
        if (!login) return res.status(404).json({ status: false, message: "Invalid Admin Email or Entered Email Does not Exist" })

        //Matching given password with original passowrd
        const pass = bcrypt.compareSync(password, login.password)
        if (!pass) return res.status(400).json({ status: false, message: "Entered Wrong Password" })

        //Generating jsonwebtoken by signing in user
        jwt.sign({ adminId: login._id }, process.env.SECRET_KEY, { expiresIn: "24hr" }, (error, token) => {
            if (error) return res.status(400).json({ status: false, message: error.message })
            res.header('authorization', token)
            return res.status(200).json({ staus: true, message: "Admin login Successfully", token: token })
        })
    }
    catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }
}




//-------------------------------create event----------------------------------//

const createEvent = async (req, res) => {
    try {
        const { eventName, eventDetails } = req.body
        const photograph = []
        // Upload photographs to Cloudinary
        if (req.files && req.files.eventPhotograph) {
            for (const photo of req.files.eventPhotograph) {
                const photographFile = await cloudinary(photo.buffer)
                photograph.push(photographFile.secure_url)
            }
        }
        const newEvent = await eventModel.create({ eventName, eventPhotograph: photograph, eventDetails })
        return res.status(201).json({ status: true, message: 'Event created successfully', event: newEvent })
    }
    catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }
}




//-------------------------------update event------------------------------------//

const updateEvent = async (req, res) => {
    try {
        const eventId = req.params.id
        // Retrieve the updated event details from the request body
        const { eventName, eventDetails } = req.body
        // Check if the event exists
        const existingEvent = await eventModel.findById(eventId)
        if (!existingEvent) return res.status(404).json({ status: false, message: 'Event not found' })

        // Update the event details
        const update = await eventModel.findOneAndUpdate({ _id: eventId }, { $set: { eventName, eventDetails } }, { new: true })

        // Upload new photographs to Cloudinary if provided in the request
        if (req.files && req.files.eventPhotograph) {
            const photographs = [];
            for (const photo of req.files.eventPhotograph) {
                const photographFile = await cloudinary(photo.buffer)
                photographs.push(photographFile.secure_url)
            }
            update.eventPhotograph = photographs
            await update.save()
        }
        return res.status(200).json({ status: true, message: 'Event updated successfully', event: update })
    }
    catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }
}




//-------------------------------delete event------------------------------------//

const deleteEvent = async (req, res) => {
    try {
        const eventId = req.params.id// Assuming the event ID is passed as a route parameter
        // Check if the event exists
        const existingEvent = await eventModel.findById(eventId)
        if (!existingEvent) return res.status(404).json({ status: false, message: 'Event not found' })

        // Check if the event is already deleted
        if (existingEvent.isDeleted) return res.status(400).json({ status: false, message: 'Event is already deleted' })

        // Soft delete the event by setting the isDeleted flag to true
        const updatedEvent = await eventModel.findOneAndUpdate({ _id: eventId }, { $set: { isDeleted: true } }, { new: true })
        return res.status(200).json({ status: true, message: 'Event deleted successfully' })
    }
    catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }
}




//-------------------------------get all event------------------------------------//

const getAllEvents = async (req, res) => {
    try {
        const events = await eventModel.find({ isDeleted: false })
        return res.status(200).json({ status: true, total: events.length, events: events })
    }
    catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }
}




//-------------------------------get event by id------------------------------------//

const getEventById = async (req, res) => {
    try {
        const eventId = req.params.id
        // Find the event by its ID
        const event = await eventModel.findById(eventId)
        // Check if the event exists
        if (!event) return res.status(404).json({ status: false, message: 'Event not found' })
        // Check if the event is deleted
        if (event.isDeleted) return res.status(404).json({ status: false, message: 'Event Not Found' })
        return res.status(200).json({ status: true, event: event })
    }
    catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }
}




//------------------------------- create user by admin------------------------------------//

const adminCreateUser = async (req, res) => {
    try {
        // Destructure the required fields from the request body
        const {
            email,
            password,
            title,
            fullName,
            fathersName,
            phoneNumber,
            gender,
            dateOfBirth,
            birthTime,
            nativePlace,
            height,
            education,
            profession,
            monthlyIncome,
            companyName,
            fathersProfession,
            numberOfSiblings,
            nameOfMaternalUncle,
            address,
            correspondingAddress,
            maritalStatus,
            age,
            religion,
            caste,
            languages,
            aboutMe
        } = req.body

        // Check if all required fields are present
        if (!email || !password || !title || !fullName || !fathersName || !phoneNumber || !gender || !dateOfBirth
            || !birthTime || !nativePlace || !height || !education || !profession || !monthlyIncome || !companyName ||
            !fathersProfession || !numberOfSiblings || !nameOfMaternalUncle || !address || !correspondingAddress || !maritalStatus ||
            !age || !religion || !caste || !languages || !aboutMe) {
            return res.status(400).json({ status: false, message: 'Please provide all required fields' })
        }

        // Check if the user already exists
        const existingUser = await userModel.findOne({ email: email })
        if (existingUser) return res.status(400).json({ status: false, message: 'User with this email already exists' })

        let passLength = password.length
        if (passLength < 8 || passLength > 14) return res.status(400).json({ status: false, message: 'Password must be between 8 and 14 characters long' })
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10)
        // Create the new user
        const newUser = await userModel.create({
            email,
            password: hashedPassword,
            title,
            fullName,
            fathersName,
            phoneNumber,
            gender,
            dateOfBirth,
            birthTime,
            nativePlace,
            height,
            education,
            profession,
            monthlyIncome,
            companyName,
            fathersProfession,
            numberOfSiblings,
            nameOfMaternalUncle,
            address,
            correspondingAddress,
            maritalStatus,
            age,
            religion,
            caste,
            languages,
            aboutMe
        })
        return res.status(201).json({ status: true, message: 'User created successfully', user: newUser })
    }
    catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }
}




//------------------------------- update user by admin------------------------------------//

const adminUpdateUser = async (req, res) => {
    try {
        const userId = req.params.id
        // Check if the user exists
        const findUser = await userModel.findById(userId)
        if (!findUser) return res.status(404).json({ status: false, message: 'User not found' })
        // If user profile already exists, update it
        let {
            title,
            fullName,
            fathersName,
            phoneNumber,
            gender,
            dateOfBirth,
            birthTime,
            nativePlace,
            height,
            education,
            profession,
            monthlyIncome,
            companyName,
            fathersProfession,
            numberOfSiblings,
            nameOfMaternalUncle,
            address,
            correspondingAddress,
            maritalStatus,
            age
        } = req.body

        const photographs = []
        if (req.files && req.files.photographs) {
            for (const photo of req.files.photographs) {
                const photographFile = await cloudinary(photo.buffer)
                photographs.push(photographFile.secure_url)
            }
        }
        let update = await userModel.findOneAndUpdate({ _id: userId },
            {
                $set:
                    title,
                fullName,
                fathersName,
                phoneNumber,
                gender,
                dateOfBirth,
                birthTime,
                nativePlace,
                height,
                education,
                profession,
                monthlyIncome,
                companyName,
                fathersProfession,
                numberOfSiblings,
                nameOfMaternalUncle,
                address,
                correspondingAddress,
                maritalStatus,
                age,
                photographs: photographs
            }, { new: true })
        return res.status(200).json({ status: true, message: 'User is updated', update })
    }
    catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }
}




//------------------------------- get all user------------------------------------//

const adminGetAllUsers = async (req, res) => {
    try {
        const {
            minAge, maxAge,
            minSalary, maxSalary,
            minHeight, maxHeight,
            gender,
        } = req.query

        let data = {}
        if (minAge && maxAge) {
            data.age = { $gte: minAge, $lte: maxAge }
        }

        if (minSalary && maxSalary) {
            data.monthlyIncome = { $gte: minSalary, $lte: maxSalary }
        }
        if (minHeight && maxHeight) {
            data.height = { $gte: minHeight, $lte: maxHeight }
        }

        if (gender) {
            data.gender = gender
        }
        const users = await userModel.find({ isDeleted: false, ...data })
        return res.status(200).json({ status: true, total: users.length, data: users })
    }
    catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }
}




//------------------------------- get user by id------------------------------------//

const adminGetUserById = async (req, res) => {
    try {
        const userId = req.params.id
        const user = await userModel.findById(userId)
        // Check if the user exists and is not deleted
        if (!user || user.isDeleted) return res.status(404).json({ status: false, message: 'User not found' })
        return res.status(200).json({ status: true, user: user })
    }
    catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }
}




//------------------------------- delete user by admin------------------------------------//

const deleteUserById = async (req, res) => {
    try {
        const user = req.params.id
        const findUser = await userModel.findById(user)
        if (!findUser) return res.status(404).json({ status: false, msg: 'user not found' })
        if (findUser.isDeleted == true) return res.status(400).json({ status: false, message: "User is already Deleted" })
        //deleting blog by its Id 
        const deleteUser = await userModel.findOneAndUpdate({ _id: user, isDeleted: false }, { $set: { isDeleted: true } })
        return res.status(200).json({ status: true, message: "User is deleted" })
    }
    catch (error) {
        return res.status(500).json({ status: false, message: error.message })
    }
}


//----------------------------------------------------------------------//


module.exports = {
    AdminSignup,
    adminLogin,
    createEvent,
    updateEvent,
    deleteEvent,
    getAllEvents,
    getEventById,
    adminCreateUser,
    adminUpdateUser,
    adminGetAllUsers,
    adminGetUserById,
    deleteUserById,
}


