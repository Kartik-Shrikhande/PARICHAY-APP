const mongoose = require("mongoose")

const userProfile = new mongoose.Schema({
    // username: {
    //     type: String,
    //     required: true,
    //     unique: true
    // },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        enum: ['Mr', 'Miss']
    },
    fullName: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enumm: ['Male', 'Female', 'Others']
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    profession: {
        type: String,
        required: true
    },
    education: {
        type: String,
        required: true
    },
    // maritalStatus: {
    //     type: String,
    //     enum: ['Single', 'Married', 'Divorced', 'Widowed'],
    //     required: true
    // },
    // religion: {
    //     type: String,
    //     // required: true
    // },
    caste: {
        type: String,
        required: true
    },
    // motherTongue: {
    //     type: String,
    //     required: true
    // },
    // languages:{
    //     type: String,
    //     required: true
    // },
    age: {
        type: Number,
        required: true
    },
    height: {
        type: String,
        required: true
    },
    income: {
        type: String,
        required: true
    },
    // complexion: {
    //     type: String,
    //     required: true
    // },
    // familyDetails: {
    //     type: String
    // },
    // aboutMe: {
    //     type: String
    // },
    // hobbiesAndInterests: {
    //     type: [String]
    // },
    //PartnerPreferences: {
    //     ageRange: {
    //         min: Number,
    //         max: Number
    //     },
    //     height: String,
    //     education: String,
    //     religion: String,
    //     caste: String,
    //     motherTongue: String
    // },
    photographs: {
        type: [String]
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    token:{
        type:String,
        require:true
    }
}, { timestamps: true })

module.exports = mongoose.model('user', userProfile);
// module.exports = { userModel };