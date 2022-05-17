const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const subcharacterSchema = new mongoose.Schema({

  skintone: {
    type: String
  },
  hairstyle: {
    type: String
  },
  headwear: {
    type: String
  },
  eyecolor: {
    type: String
  },
  clothes: {
    type: Array
  },
  accessories: {
    type: Array
  }
},
{ timestamps: true }
)
const tableSchema = new mongoose.Schema({
  userId: {
    trim: true,
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  characterData: [subcharacterSchema]
},
{ timestamps: true }
)
module.exports = mongoose.model('character', tableSchema)