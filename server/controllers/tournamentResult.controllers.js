const tournamentResult = require('../models/tournamentResult')

exports.create = async (req, res) => {
  try {
    const { tournament_id, distance, time, collected_chillies } = req.body
    const newtournament = new tournamentResult({
      user: req.user.id ,
      tournament: tournament_id ,
      distance: distance,
      time: time,
      collected_chillies: collected_chillies
    })
    await newtournament.save()
    res.send({status: "success"})

  } catch (error) {
    return res.status(401).send(error.message);
  }
}

exports.findOne = async(req, res) => {
    try {
      const _id = req.params.id
      const data =  await tournamentResult.findById(_id)
      return res.send(data)
    } catch (error) {
      return res.status(401).send(error.message);
    }
  }
  exports.update = async(req, res) => {
    try {
      const _id = req.params.id
      const data =  await tournamentResult.findByIdAndUpdate(_id,req.body)
      if (data) {
        res.send({ status: 'success'})
      } else {
        res.status(400).send({ status: 'false' })
      }
    } catch (error) {
      return res.status(401).send(error.message);
    }
  }

exports.findAll = async(req, res) => {
  try {
    const data =  await tournamentResult.find()
    return res.send(data)
  } catch (error) {
    return res.status(401).send(error.message);
  }
}
exports.delete = async(req, res) => {
  try {
    const _id = req.params.id
    const data =  await tournamentResult.findByIdAndRemove(_id)
    if (data) {
      res.send({ status: 'success'})
    } else {
      res.status(400).send({ status: 'false'})
    }
  } catch (error) {
    return res.status(401).send(error.message);
  }
}