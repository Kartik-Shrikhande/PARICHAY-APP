const userModel = require("../models/user.Model")
const eventModel = require("../models/event.model")
const cloudinary = require('../.config/cloudinary')
const communityModel = require("../models/comminityModel")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config({ path: '.env' })
const { body, validationResult } = require('express-validator')
const subscriptionModel = require('../models/subscription.model')


//-----------------------------user signup----------------------------//

const userSignup = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    try {
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
            aboutMe,

        } = req.body;

        const photographs = [];
        if (req.files && req.files.photographs) {
            for (const photo of req.files.photographs) {
                const photographFile = await cloudinary(photo.buffer)
                photographs.push(photographFile.secure_url);
            }
        }
        const existingUser = await userModel.findOne({ email: email })
        if (existingUser) return res.status(400).json({ message: 'User with this email already exists' })
        // Hashing the password
        const hashedPassword = await bcrypt.hash(password, 10)
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
            aboutMe,
            photographs: photographs
        });
        const token = jwt.sign({ userId: newUser._id }, process.env.SECRET_KEY, { expiresIn: '1d' })
        res.setHeader('token', token);
        return res.status(201).json({ message: 'User created successfully', user: newUser, token: token })
    }
    catch (error) {
        return res.status(500).json({ message: error.message })
    }
}



//------------------------------user login-----------------------------//

const userlogin = async (req, res) => {
    try {
        // Extracting user input from request body
        const { email, password } = req.body
        if (Object.keys(req.body).length == 0) return res.status(400).json({ status: false, message: "Enter Required Data" })

        // Check if the user exists
        const user = await userModel.findOne({ email: email })
        if (!user) return res.status(401).json({ message: 'Invalid email' })

        // Verify the password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) return res.status(401).json({ message: 'Invalid password' })

        // If user credentials are valid, generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '24h' })
        res.setHeader('Authorization', token);
        return res.status(200).json({ message: 'User log successfully', token: token })
    }
    catch (error) {
        return res.status(500).json({ message: error.message })
    }
}



//------------------------------get all users-----------------------------//

const getAllUsers = async (req, res) => {
    try {
        const {
            minAge, maxAge,
            minSalary, maxSalary,
            minHeight, maxHeight,
            gender,
        } = req.query

        let data = {};
        if (minAge && maxAge) {
            data.age = { $gte: minAge, $lte: maxAge }
        };

        if (minSalary && maxSalary) {
            data.monthlyIncome = { $gte: minSalary, $lte: maxSalary }
        };

        if (minHeight && maxHeight) {
            data.height = { $gte: minHeight, $lte: maxHeight }
        };

        if (gender) {
            data.gender = gender
        };
        const users = await userModel.find({ isDeleted: false, ...data })
        return res.status(200).json({ total: users.length, data: users })
    }
    catch (error) {
        return res.status(500).json({ message: error.message })
    }
}



//------------------------------get user by Id-----------------------------//

const getUser = async (req, res) => {
    try {
        const user = req.userId
        const findUser = await userModel.findOne({ _id: user, isDeleted: false })
        if (!findUser) return res.status(404).json({ msg: 'user not found' })
        return res.status(200).json(findUser)
    }
    catch (error) {
        return res.status(500).json({ message: error.message })
    }
}



//------------------------------update user profile-----------------------------//

const updateUserProfile = async (req, res) => {
    try {
        const userId = req.userId
        // Check if the user exists
        const findUser = await userModel.findById(userId);
        if (!findUser) return res.status(404).json({ message: 'User not found' })
        // Check if the user profile exists
        let userProfile = await userModel.findById(userId);
        if (!userProfile) return res.status(404).json({ message: 'User Profile not found' })
        // If user profile doesn't exist, create a new one
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

        const photographs = [];
        if (req.files && req.files.photographs) {
            for (const photo of req.files.photographs) {
                const photographFile = await cloudinary(photo.buffer)
                photographs.push(photographFile.secure_url);
            }
        }
        // update blog document
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
            },
            { new: true })
        return res.status(200).json({ status: true, message: 'User updated Successfully', update })
    }
    catch (error) {
        return res.status(500).json({ message: error.message })
    }
}



//------------------------------delete user profile-----------------------------//

const deleteUser = async (req, res) => {
    try {
        const user = req.userId
        const findUser = await userModel.findById(user);
        if (!findUser) return res.status(404).json({ msg: 'user not found' })
        if (findUser.isDeleted == true) return res.status(400).json({ status: false, message: "User is already Deleted" })
        //deleting blog by its Id 
        const deleteUser = await userModel.findOneAndUpdate({ _id: user, isDeleted: false }, { $set: { isDeleted: true } })
        return res.status(200).json({ status: true, message: "User is deleted" })
    }
    catch (error) {
        return res.status(500).json({ message: error.message })
    }
}



//------------------------------update user password-----------------------------//

const updatePassword = async (req, res) => {
    try {
        const userId = req.userId
        const { currentPassword, newPassword, confirmPassword } = req.body
        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: 'Please provide currentPassword, newPassword, and confirmPassword' })
        }
        //validating password length
        let length = newPassword.length
        if (length < 8 || length > 14) return res.status(400).json({ message: 'Password must be between 8 and 14 characters long' })
        // Find the user in the database based on userId
        const user = await userModel.findById(userId);

        // Check if the user exists
        if (!user) return res.status(404).json({ message: 'User not found' })
        // Check if the current password matches the password stored in the database
        const isPasswordMatch = await bcrypt.compare(currentPassword, user.password)
        if (!isPasswordMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' })
        }
        // Check if the new password matches the confirm password
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'New password and confirm password do not match' })
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        return res.status(200).json({ message: 'Password updated successfully' })
    }
    catch (error) {
        return res.status(500).json({ message: error.message })
    }
}



//------------------------------subscription plans price list-----------------------------//

const pricesList = async (req, res) => {
    try {
        const prices = [
            { plan: 'Basic', price: 200, subscriptionTiming: '10 days', profileVisits: 100 },
            { plan: 'Economy', price: 400, subscriptionTiming: '30 days', profileVisits: 200 },
            { plan: 'Premium', price: 1000, subscriptionTiming: '90 days', profileVisits: 1000 },
        ];

        const admin_name = "Project Name"
        const admin_desc = "Description"
        const admin_contact = "Mobile Number"
        const admin_email = "test@email.com"
        const admin_key = "rzp_test_1DP5mmOlF5G5ag"

        return res.status(200).json({
            status: true, prices: prices, admin_name: admin_name, admin_desc: admin_desc, admin_contact: admin_contact,
            admin_email: admin_email, admin_key: admin_key
        })
    }
    catch (err) {
        return res.status(500).json({ status: false, message: err.message })
    }
}



//------------------------------subscription API-----------------------------//

const subscription = async (req, res) => {
    try {
        const user = req.userId
        const findUser = await userModel.findById(user);
        if (!findUser) return res.status(404).json({ msg: 'user not found' })

        const { price } = req.body
        const validPrices = [200, 400, 1000]
        if (!validPrices.includes(price)) return res.status(400).json({ msg: 'Invalid price : Availables plans are 200, 400, and 1000' })

        findUser.isSubscribed = "true"
        await findUser.save()
        const subscription = await subscriptionModel.create({ userId: user, price, })
        return res.status(200).json({ message: 'Subscription added for user', subscription: subscription })
    }
    catch (err) {
        return res.status(500).json({ status: false, message: err.message })
    }
}



//------------------------------get all events-----------------------------//

const getAllEvents = async (req, res) => {
    try {
        const events = await eventModel.find({ isDeleted: false })
        return res.status(200).json({ total: events.length, events: events })
    }
    catch (error) {
        return res.status(500).json({ message: error.message })
    }
}



//------------------------------get all community members-----------------------------//

const getCommunityMembers = async (req, res) => {
    try {
        const user = req.userId
        const findUser = await userModel.findById(user)
        if (!findUser) return res.status(404).json({ msg: 'user not found' })
        // Retrieve all community members that have not been marked as deleted
        const members = await communityModel.find({ isDeleted: false })
        // Return the list of community members in the response
        return res.status(200).json({ total: members.length, members })
    }
    catch (error) {
        return res.status(500).json({ message: error.message })
    }
}


//-----------------------------------------------------------------------//

module.exports = {
    userSignup,
    userlogin,
    getAllUsers,
    getUser,
    updateUserProfile,
    deleteUser,
    updatePassword,
    pricesList,
    subscription,
    getAllEvents,
    getCommunityMembers
}



