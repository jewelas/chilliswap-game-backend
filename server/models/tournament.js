const { string } = require('joi')
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const tournamentSchema = new mongoose.Schema({

  userId: {
    trim: true,
    type: Schema.Types.ObjectId,
    ref: "user",
  }
  
},
{ timestamps: true }
)
module.exports = mongoose.model('tournament', tournamentSchema)