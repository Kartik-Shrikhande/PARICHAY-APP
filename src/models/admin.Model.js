const mongoose = require('mongoose')


const adminSignup = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    type: {
        type: String,
        default: 'Admin'
    },
}, { timestamps: true })


module.exports = mongoose.model('admin', adminSignup)