
const Joi = require('joi')
 const login = (user) => { //register validations
    const schema = Joi.object({
    publicAddress: Joi.string().required(),
    signature: Joi.string().required(),


    })
    return schema.validate(user)
  }
module.exports = {register, login}