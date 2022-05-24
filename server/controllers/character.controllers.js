const Character = require('../models/character')

exports.set = async (req, res) => {
  try {
    // const { skintone, hairstyle, eyecolor, clothes, accessories  } = req.body
    
    // await Character.updateOne(
    //   { "userId": req.user.id },
    //   { $push: {"list": { skintone, hairstyle, eyecolor, clothes, accessories }}},
    //   {upsert: true}
    // )
    const isExist = await Character.findOne({"userAddress" : req.user.publicAddress});
    if(isExist) {
      await Character.updateOne(
        { "userAddress" : req.user.publicAddress },
        {  "characterData": req.body[0].SetCharacter},
      )
    }
    else {
      const newCharacter = new Character ({
        userAddress: req.user.publicAddress,
        userId: req.user.id,
        characterData: req.body[0].SetCharacter
      })
      await newCharacter.save();
    }
    res.send({status: "success"})

  } catch (error) {
    return res.status(401).send(error.message);
  }
}

exports.get = async(req, res) => {
  try {
    const userId = req.user.id
    const data =  await Character.find({userId})
    return res.send(data)
  } catch (error) {
    return res.status(401).send(error.message);
  }
}