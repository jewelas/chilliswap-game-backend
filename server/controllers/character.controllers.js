const character = require('../models/character')

exports.set = async (req, res) => {
  try {
    const {} = req.body
    const newCharacter = new character({ 
      userId: req.user.id
    })
    await newCharacter.save()
    res.send({status: "success"})

  } catch (error) {
    return res.status(401).send(error.message);
  }
}

exports.get = async(req, res) => {
  try {
    const userId = req.user.id
    const data =  await character.find({userId})
    return res.send(data)
  } catch (error) {
    return res.status(401).send(error.message);
  }
}