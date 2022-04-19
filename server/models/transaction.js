const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
  date: {
    type: Date,
  },
  username: {
    type: String,
  },
  type: {
    type: String,
  },
  tokenId: {
    type: String,
  },
  value: {
    type: String,
  },
  hash: {
    type: String,
    unique: true
  },
  from: {
    type: String,
  },
  to: {
    type: String,
  },
  currency: {
    type: String,
  },

})
module.exports = mongoose.model('Transaction', transactionSchema)
