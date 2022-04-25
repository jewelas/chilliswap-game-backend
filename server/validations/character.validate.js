
const Joi = require('joi')
const validate = (request) => { 
    const schema = Joi.object({
      title: Joi.string().required(),
      description: Joi.string()
    })
    return schema.validate(request)
  }
module.exports = validate