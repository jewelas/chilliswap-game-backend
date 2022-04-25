const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const tournamentSchema = new mongoose.Schema({

  userId: {
    trim: true,
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  active: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    trim: true,
    required: true,
  },
  
},
{ timestamps: true }
)
module.exports = mongoose.model('tournament', tournamentSchema)