const router = require('express').Router()
const { register, login } = require('../models/user')
const validateMiddleware =require('../middleware/validateMiddleware')

const authController = require('../controllers/auth')

router.post('/',[validateMiddleware(login)], authController.login)
router.post('/register',[validateMiddleware(register)], authController.register)

module.exports = router