const tournamentResult = require('../models/tournamentResult')
exports.get = async(req, res) => {
    try {
      const _id = req.params.tournamentId
      const data =  await tournamentResult.find({tournament: _id})
      .select({distance: 1,time: 1, collected_chillies: 1 })
      .populate('user',{username: 1, _id: 0})
      return res.send(data)
    } catch (error) {
      return res.status(401).send(error.message);
    }
  }

