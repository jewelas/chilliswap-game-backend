
const Joi = require('joi')
const validate = (user) => { //register validations
    const schema = Joi.object({
      title: Joi.string().required(),
      startDate: Joi.string(),
      endDate: Joi.string()
    })
    return schema.validate(user)
  }
module.exports = validate