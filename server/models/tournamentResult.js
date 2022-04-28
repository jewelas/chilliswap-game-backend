const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const tableSchema = new mongoose.Schema({

  user: {
    trim: true,
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  tournament: {
    trim: true,
    type: Schema.Types.ObjectId,
    ref: "tournament",
  },
  time: {
    type: String
  },
  distance: {
    type: String
  },
  collected_chillies: {
    type: String
  }
},
{ timestamps: true }
)
module.exports = mongoose.model('tournament_result', tableSchema)