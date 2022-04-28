
const Joi = require('joi')
const validate = (request) => { 
    const schema = Joi.object({
      skintone: Joi.string().required(),
      hairstyle: Joi.string().required(),
      eyecolor: Joi.string().required(),
      clothes: Joi.array().required(),
      accessories: Joi.array().required()
    })
    return schema.validate(request)
  }
module.exports = validate