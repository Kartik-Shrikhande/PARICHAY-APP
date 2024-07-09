const mongoose = require('mongoose')


const community = new mongoose.Schema({
    memberName: {
        type: String,
        required: true
    },
    photograph: [{
        type: String,
    }],
    position: {
        type: String,
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
},{ timestamps: true })


module.exports = mongoose.model('community', community)