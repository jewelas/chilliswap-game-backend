const tournament = require('../models/tournament')

exports.create = async (req, res) => {
  try {
    const { startDate, endDate, title,  } = req.body
    const newtournament = new tournament({ 
      userId: req.user.id,
      startDate: startDate,
      endDate: endDate,
      title: title
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
      const data =  await tournament.findById(_id)
      return res.send(data)
    } catch (error) {
      return res.status(401).send(error.message);
    }
  }
  exports.update = async(req, res) => {
    try {
      const _id = req.params.id
      const data =  await tournament.findByIdAndUpdate(_id,req.body)
      if (data) {
        return res.send({ status:'success'})
      } else {
        return res.status(400).send({ status:'false'})
      }
    } catch (error) {
      return res.status(401).send(error.message);
    }
  }

exports.findAll = async(req, res) => {
  try {
    const userId = req.user.id
    const data =  await tournament.find({userId})
    return res.send(data)
  } catch (error) {
    return res.status(401).send(error.message);
  }
}
exports.delete = async(req, res) => {
  try {
    const _id = req.params.id
    const data =  await tournament.findByIdAndRemove(_id)
    if (data) {
      return res.send({ status:'success'})
    } else {
      return res.status(400).send({ status:'false'})
    }
  } catch (error) {
    return res.status(401).send(error.message);
  }
}