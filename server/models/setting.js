const mongoose = require('mongoose')

const settingSchema = new mongoose.Schema({
  category: [],

})
module.exports = mongoose.model('Setting', settingSchema)
