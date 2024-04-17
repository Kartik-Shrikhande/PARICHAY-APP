const mongoose = require('mongoose');

const event = new mongoose.Schema({
   eventName: {
        type: String,
        required:true
    },
   eventPhotograph :[{
    type: String,
    // required: true
}],
    eventDetails: {
        type: String,
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
},{timestamps:true}
)

module.exports = mongoose.model('event', event)