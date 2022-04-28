const character = require('../models/character')

exports.set = async (req, res) => {
  try {
    const { skintone, hairstyle, eyecolor, clothes, accessories  } = req.body
    
    await character.updateOne(
      { "userId": req.user.id },
      { $push: {"list": { skintone, hairstyle, eyecolor, clothes, accessories }}},
      {upsert: true}
    )
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