const mongoose = require('mongoose')


// Define User Schema
const userSubscription = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    price: {
        type: Number,
        required: true
    },
}, { timestamps: true })


module.exports = mongoose.model('subscription', userSubscription)