const mongoose = require('mongoose')


const adminSignup = new mongoose.Schema({
    AdminName: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
}, { timestamps: true })


module.exports = mongoose.model('admin', adminSignup)