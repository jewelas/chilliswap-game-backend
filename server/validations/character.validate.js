
const Joi = require('joi')
const validate = (request) => { 
    const schema = Joi.array().items(
      Joi.object({
        SetCharacter: Joi.array().items(
          Joi.object({
            skintone: Joi.string().required().allow('', null),
            hairstyle: Joi.string().required().allow('', null),
            eyecolor: Joi.string().required().allow('', null),
            clothes: Joi.array().required().allow('', null),
            accessories: Joi.array().required().allow('', null)
          })
        )
      })
    )
    return schema.validate(request)
  }
module.exports = validate