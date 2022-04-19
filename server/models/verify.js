const mongoose = require('mongoose')


const verifySchema = new mongoose.Schema({
    publicAddress: {
        type: String,
        unique: true
    },
    username: {
        type: String,
    },
    twitter:{
        type: String,
        default: false
    },
    status:{
        type: String,
        default: "pending"
    }
   
})
module.exports = mongoose.model("Verify", verifySchema)
