
const Joi = require('joi')
const validate = {}
validate.create = (request) => { 
  const schema = Joi.object({
  tournament_id: Joi.string().required(),
  distance: Joi.string().required(),
  time: Joi.string().required(),
  collected_chillies: Joi.string()
  })
  return schema.validate(request)
}
validate.update = (request) => { 
  const schema = Joi.object({
  collected_chillies: Joi.string()
  })
  return schema.validate(request)
}
module.exports = validate