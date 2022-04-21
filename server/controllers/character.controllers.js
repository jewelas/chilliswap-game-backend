const character = require('../models/character')

exports.set=(req, res) => {
  try {
    const {} = req.body
  } catch (error) {
    return res.status(401).send(err);
  }
}

exports.get = async(req, res) => {
  try {
    const userId = req.user.id
    const data =  await character.find({userId})
    return res.send(data)
  } catch (error) {
    return res.status(401).send(err);
  }
}