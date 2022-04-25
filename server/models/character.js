const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const subcharacterSchema = new mongoose.Schema({
  title: {
    type: String
  },
  description: {
    type: String
  }
},
{ timestamps: true }
)
const characterSchema = new mongoose.Schema({
  userId: {
    trim: true,
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  list: [subcharacterSchema]
},
{ timestamps: true }
)
module.exports = mongoose.model('character', characterSchema)