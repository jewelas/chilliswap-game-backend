const mongoose = require('mongoose')

const tableSchema = new mongoose.Schema({

  tournament_name: {
    type: String,
    trim: true,
    required: true,
  },
  duration: {
    type: String,
  },
  timestamp: {
    type: String
  },
  start_date: {
    type: Date,
  },
  end_date: {
    type: Date,
  },
  active: {
    type: Boolean,
    default: true,
  },
  players: {
    type: [String],
  }
  
},
{ timestamps: true }
)
module.exports = mongoose.model('tournament', tableSchema)