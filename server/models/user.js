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
    },
    tokenIds: {
      type: Array,
      default: []
    },
    tokenURIs: {
      type: Array,
      default: []
    },
    chillis: {
      type: Number,
      default: 0
    },
    username: {
      type: String,
      default: ""
    }
})


module.exports =  mongoose.model('user', userSchema)
