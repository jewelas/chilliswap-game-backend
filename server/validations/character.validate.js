
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
          accessories: Joi.array().required().allow('', null),
          goggles: Joi.string().required().allow('', null),
          headphones: Joi.string().required().allow('', null),
          backpack: Joi.string().required().allow('', null),
          watch: Joi.string().required().allow('', null),
          shoes: Joi.string().required().allow('', null),
          headwear: Joi.string().required().allow('', null),
          bodytype: Joi.string().valid('boy','girl').required()
        })
      )
    })
  )
  return schema.validate(request)
}
module.exports = validate