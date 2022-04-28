const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const tableSchema = new mongoose.Schema({

  userId: {
    trim: true,
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  tournamentId: {
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