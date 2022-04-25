const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({

    nonce: {
        type: Number
    },
    publicAddress: {
        type: String,
        unique: true
    },
    active: {
        type: Boolean,
        default: true
    },



})

const User = mongoose.model('user', userSchema)//table

module.exports = {User}
