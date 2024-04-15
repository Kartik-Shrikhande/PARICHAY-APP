const mongoose = require("mongoose")

const userProfile = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
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
    fathersName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Others']
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    birthTime: {
        type: String,
        required: true
    },
    nativePlace: {
        type: String,
        required: true
    },
    height: {
        type: String,
        required: true
    },
    education: {
        type: String,
        required: true
    },
    profession: {
        type: String,
        required: true
    },
    monthlyIncome: {
        type: String,
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    fathersProfession: {
        type: String,
        required: true
    },
    numberOfSiblings: {
        type: {
            numberOfBrothers: {
                type: Number,
                required: true
            },
            numberOfSisters: {
                type: Number,
                required: true
            }
        },
        required: true
    },
    nameOfMaternalUncle: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    correspondingAddress: {
        type: String,
        required: true
    },
    maritalStatus: {
        type: String,
        enum: ['Single', 'Divorced', 'Widowed'],
        required: true
    },
    religion: {
        type: String,
        default: 'Hindu'
    },
    caste: {
        type: String,
        default: 'Sutar'
    },
    languages: [{
        type: String,
    }],
    age: {
        type: Number,
        required: true
    },
    aboutMe: {
        type: String
    },
    photograph: {
        type: String,
        required: true
    },
    isSubscribed: {
        type: String,
        default: "false"
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        default: 'User'
    },
    token: {
        type: String,
    
    }

}, { timestamps: true })

module.exports = mongoose.model('user', userProfile);

// hobbiesAndInterests: {
//     type: [String]
// },
// PartnerPreferences: {
//     ageRange: {
//         min: Number,
//         max: Number
//     },
//     height: String,
//     education: String,
//     religion: String,
//     caste: String,
//     languages: String
// },
