const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    nonce: {
        type: Number
    },
    publicAddress: {
        type: String,
        unique: true
    },
    username: {
        type: String,
    },
    fullname: {
        type: String
    },
    email: {
        type: String
    },
    bio: {
        type: String
    },
    mobile: {
        type: String
    },
    role:{
        type: String
    },
    coverImg:{
        type: String
    },
    avatar:{
        type: String
    },
    instagram:{
        type: String
    },
    facebook:{
        type: String
    },
    youtube:{
        type: String
    },
    tiktok:{
        type: String
    },
    following: {
        type: []
    },
    followers:{
        type: []
    },
    rank:{
        type: Number,
        default: 100
    },
    coverImg:{
        type: String
    },
    document:{
        type: String
    },
    verifyTwitter:{
        type: Boolean,
        default: false
    },
    verifyinstagram:{
        type: Boolean,
        default: false
    }


})
module.exports = mongoose.model("User", userSchema)
