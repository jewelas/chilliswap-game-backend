const mongoose = require('mongoose')
const Joi = require('joi')


const userSchema = new mongoose.Schema({
    nonce: {
        type: Number
    },
    publicAddress: {
        type: String,
        unique: true
    },
    // email: {
    //     type: String,
    //     // unique :true
    // },
    username: {
        type: String,
        // unique :true
    },
    // password: {
    //     type: String 
    // }


})

const User = mongoose.model('user', userSchema)//table

module.exports = {User}
