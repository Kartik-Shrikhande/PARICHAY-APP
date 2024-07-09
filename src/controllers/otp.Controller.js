const sgMail = require('@sendgrid/mail');
const userModel = require("../models/user.Model");
const otpModel = require('../models/otp.model')
const bcrypt = require('bcrypt')
require('dotenv').config({ path: './.env' })


//---------------------------function to generate 6 digit OTP--------------------------//

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000) // Generate a 6-digit OTP
}


//---------------------------OTP generation API for email--------------------------//

const sendOTPByEmail = async (recipientEmail, otp) => {
    try {
        sgMail.setApiKey(process.env.SENDGRIDKEY)
        const msg = {
            to: recipientEmail,
            from: process.env.EMAIL,
            subject: 'OTP for Email Verification',
            text: `Your OTP for email verification is ${otp}`,
            html: `<strong>Your OTP for email verification is ${otp}</strong>`,
        }
        await sgMail.send(msg);
        console.log('OTP sent successfully')
    }
    catch (error) {
        console.log("28", error.message)
    }
}



//---------------------------OTP sent API on email--------------------------//

const otpSent = async (req, res) => {
    try {
        const { email } = req.body
        const user = await userModel.findOne({ email: email })
        if (!user) return res.status(404).json({ message: 'Email not found' })

        const otp = generateOTP()
        console.log(otp)

        await sendOTPByEmail(email, otp);
        const otpRecord = await otpModel.create({ email, otp, date: new Date().getTime() })
        return res.status(200).json({ message: 'OTP sent successfully', data: { otpId: otpRecord._id, email } })
    }
    catch (error) {
        return res.status(500).json({ message: error.message })
    }
}



//-----------------------------verify OTP----------------------------//

const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body
        // Fetch the OTP record based on the user's email
        const otpRecord = await otpModel.findOne({ email })
        if (!otpRecord) return res.status(404).json({ message: 'please re-generate OTP' })
        // Verify the OTP
        if (otpRecord.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' })
        // OTP is verified successfully
        return res.status(200).json({ message: 'OTP verified successfully' })
    }
    catch (error) {
        return res.status(500).json({ message: error.message })
    }
}



//-----------------------------reset password----------------------------//

// Reset the user's password using OTP API
const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body
        const user = await userModel.findOne({ email })
        if (!user) return res.status(404).json({ message: 'User not found' })

        let passLength = newPassword.length
        if (passLength < 8 || passLength > 14) return res.status(400).json({ status: false, message: 'Password must be between 8 and 14 characters long' })

        const otpRecord = await otpModel.findOne({ email: email })
        if (!otpRecord) return res.status(404).json({ message: 'please verify OTP' })

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword;
        await user.save();
        await otpRecord.deleteOne();
        return res.status(200).json({ message: 'Password reset successfully' })
    }
    catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

//----------------------------------------------------------------------------//


module.exports = {
    otpSent,
    verifyOTP,
    resetPassword,
}