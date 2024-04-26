const sgMail = require('@sendgrid/mail');
const userModel = require("../models/user.Model");
const otpModel = require('../models/otp.model')
const bcrypt = require('bcrypt')
require('dotenv').config({ path: './.env' })


const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
};


const sendOTPByEmail = async (recipientEmail, otp) => {
    try {
        sgMail.setApiKey(process.env.SENDGRIDKEY);
        const msg = {
            to: recipientEmail,
            from:process.env.EMAIL, 
            subject: 'OTP for Email Verification',
            text: `Your OTP for email verification is ${otp}`,
            html: `<strong>Your OTP for email verification is ${otp}</strong>`,
        };
        await sgMail.send(msg);
        console.log('OTP sent successfully');
    }
    catch (error) {
        // return res.status(500).json({ message: error.message });
        console.log("28", error.message);
    }
};




// API endpoint for requesting password reset OTP
const otpSent = async (req, res) => {
    try {

        const { email } = req.body;
        const user = await userModel.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: 'Email not found' });
        }
        const otp = generateOTP();
        console.log(otp);
        // user.passwordResetOTP = otp;

        await sendOTPByEmail(email, otp);
        const otpRecord = await otpModel.create({ email, otp, date: new Date().getTime() })
        return res.status(200).json({ message: 'OTP sent successfully', data: { otpId: otpRecord._id, email } })
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


// Verify the OTP API
const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Fetch the OTP record based on the user's email
        const otpRecord = await otpModel.findOne({ email });
        if (!otpRecord) {
            return res.status(404).json({ message: 'Invalid Email' });
        }

        // Verify the OTP
        if (otpRecord.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // Check if the OTP is expired (e.g., if it's older than 10 minutes)
        // const otpExpiryTime = 10 * 60 * 1000; // 10 minutes
        // if (Date.now() - otpRecord.date > otpExpiryTime) {
        //     return res.status(400).json({ message: 'OTP has expired' });
        // }

        // OTP is verified successfully
        return res.status(200).json({ message: 'OTP verified successfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};




// Reset the user's password using OTP API
const resetPassword = async (req, res) => {
    try {
        const { email,newPassword } = req.body;

  
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const otpRecord = await otpModel.findOne({ email: email });
                if (!otpRecord) {
                    return res.status(404).json({ message: 'OTP record not found' });
                }
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        await otpRecord.deleteOne();
        return res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// const setNewPassword = async (req, res) => {
//     try {

//         const { email, newPassword,otp } = req.body;
//         if (!email) return res.status(400).json({ message: 'Enter Email' })
//         if (!newPassword) return res.status(400).json({ message: 'Enter newPassword' })
//         if (!otp) return res.status(400).json({ message: 'Enter otp' })

//         const user = await userModel.findOne({ email: email });
//         if (!user) {
//             return res.status(404).json({ message: 'Email not found' });
//         }
        
//         // Fetch the OTP record based on the user's email
//         const otpRecord = await otpModel.findOne({ email: email });
//         if (!otpRecord) {
//             return res.status(404).json({ message: 'OTP record not found' });
//         }

//         // Verify the OTP
//         if (otpRecord.otp !== req.body.otp) {
//             return res.status(400).send({ error: true, message: "Invalid OTP" });
//         }

//         // Update the password
//         user.password = await bcrypt.hash(newPassword, 10);
//         await user.save();

//         // Delete the OTP record as it is no longer needed
//         await otpRecord.deleteOne();

//         return res.status(200).json({ message: 'Password updated successfully', data: { newPassword } });
//     } catch (error) {
//         return res.status(500).json({ message: error.message });
//     }
// };


// const  updatePassword = async (req, res) => {
//     try {
//         const { email, otp, newPassword } = req.body;
//         const user = await userModel.findOne({ email })

//         if (!user || user.otp !== otp) {
//             return res.status(400).json({ message: 'Invalid OTP or email' })
//         }
//         const hashedPassword = await bcrypt.hash(newPassword, 10);
//         // Update user's password and clear OTP
//         user.password = hashedPassword
//         user.otp = ''
//         await user.save();
//         return res.json({ message: 'Password reset successfully' })
//     }
//     catch (error) {
//         return res.status(500).json({ message: error.message })
//     }
// };




module.exports = {
    otpSent,
    verifyOTP,
    resetPassword,
}