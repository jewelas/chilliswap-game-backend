const mongoose = require('mongoose')
const Joi = require('joi')


const userSchema = new mongoose.Schema({
    nonce: {
        type: Number
    },
    publicAddress: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique :true
    },
    username: {
        type: String,
        unique :true
    },
    // password: {
    //     type: String 
    // }


})

const User = mongoose.model('user', userSchema)//table

const register = (user) => { //register validations
    const schema = Joi.object({
      email: Joi.string().email().min(5).max(500).required(),
      password: Joi.string().min(8).max(1024).required(),
      username: Joi.string().min(8).max(1024).required(),
      publicAddress: Joi.string().required(),
      signature: Joi.string(),
    })
    return schema.validate(user)
  }

  const login = (user) => { //register validations
    const schema = Joi.object({
    //   email: Joi.string().email().min(5).max(500).required(),
    //   password: Joi.string().min(8).max(1024).required(),
    //   username: Joi.string().min(8).max(1024).required(),
    publicAddress: Joi.string().required(),
    signature: Joi.string().required(),


    })
    return schema.validate(user)
  }
module.exports = {User, register, login}
