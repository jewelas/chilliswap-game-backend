
const Joi = require('joi')
const validate = (request) => { 
    const schema = Joi.object({
      tournament_name: Joi.string().required(),
      duration: Joi.string().required(),
      timestamp: Joi.string().required(),
      start_date: Joi.string(),
      end_date: Joi.string()
    })
    return schema.validate(request)
  }
module.exports = validate