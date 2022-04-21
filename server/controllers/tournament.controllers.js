const tournament = require('../models/tournament')

exports.add = async (req, res) => {
  try {
    const {} = req.body
    const newtournament = new tournament({ 
      userId: req.user.id
    })
    await newtournament.save()
    res.send({status: "success"})

  } catch (error) {
    return res.status(401).send(error.message);
  }
}

exports.edit = async(req, res) => {
    try {
      const userId = req.user.id
      const data =  await tournament.find({userId})
      return res.send(data)
    } catch (error) {
      return res.status(401).send(error.message);
    }
  }

exports.get = async(req, res) => {
  try {
    const userId = req.user.id
    const data =  await tournament.find({userId})
    return res.send(data)
  } catch (error) {
    return res.status(401).send(error.message);
  }
}