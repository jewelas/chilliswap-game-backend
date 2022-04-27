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
    token_amount: {
      type: Number,
      default: 0
    }
})


module.exports =  mongoose.model('user', userSchema)
