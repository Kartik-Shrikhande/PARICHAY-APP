const mongoose = require('mongoose');

// Define User Schema
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
 

},{timestamps:true}
)

module.exports = mongoose.model('admin', adminSignup)