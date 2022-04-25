
const Joi = require('joi')
const validate = (request) => { 
    const schema = Joi.object({
      title: Joi.string().required(),
      startDate: Joi.string(),
      endDate: Joi.string()
    })
    return schema.validate(request)
  }
module.exports = validate