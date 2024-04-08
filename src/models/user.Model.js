const mongoose = require("mongoose")

const userProfile = new mongoose.Schema({
    email: {
        type: String,
       required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
      //   required: true
    },
    password: {
      type: String,
    required: true
  },
    title: {
        type: String,
       //   required: true,
        enum: ['Mr', 'Miss']
    },
    fullName: {
        type: String,
      //   required: true
    },
    gender: {
        type: String,
     //   required: true,
        enumm: ['Male', 'Female', 'Others']
    },
    dateOfBirth: {
        type: Date,
      //   required: true
    },
    address: {
        type: String,
    //   required: true
    },
    profession: {
        type: String,
    //   required: true
    },
    education: {
        type: String,
    //   required: true
    },
    maritalStatus: {
        type: String,
        enum: ['Single', 'Divorced', 'Widowed'],
      //   required: true
    },
    religion: {
        type: String,
    //   required: true
    },
    caste: {
        type: String,
    //   required: true
    },
    languages: [{
        type: String,
    //   required: true
    }],
    age: {
        type: Number,
    //   required: true
    },
    height: {
        type: String,
    //   required: true
    },
    income: {
        type: String,
    //   required: true
    },
    aboutMe: {
        type: String
    },
    hobbiesAndInterests: {
        type: [String]
    },
    PartnerPreferences: {
        ageRange: {
            min: Number,
            max: Number
        },
        height: String,
        education: String,
        religion: String,
        caste: String,
        languages: String
    },
    photograph: {
        type: String
    },
    connections: [{ 
        type: mongoose.Schema.Types.ObjectId,
         ref: 'user' 
    }],
      pendingRequests: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user'
     }],
     receivedRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],

    chatHistory: [{
        senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
        receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
        message: String,
        timestamp: { type: Date, default: Date.now }
      }],

      isSubscribed:{
        type:String,
        
      },
    isDeleted: {
        type: Boolean,
        default: false
    },
    type:{
        type: String,
        default:'User'
    },
    token: {
        type: String,
        // require: true
    }
}, { timestamps: true })

module.exports = mongoose.model('user', userProfile);
