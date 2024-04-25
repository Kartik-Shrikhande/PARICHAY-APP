const mongoose = require('mongoose');

const otpmodel = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true }
)
module.exports = mongoose.model('otp', otpmodel);
