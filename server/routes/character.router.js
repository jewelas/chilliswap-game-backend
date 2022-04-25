const router = require('express').Router()
const auth = require("../middleware/auth");
const validateMiddleware =require('../middleware/validateMiddleware')

const characterController = require('../controllers/character.controllers')
const validate = require('../validations/character.validate')


router.post('/set',[auth, validateMiddleware(validate) ], characterController.set)
router.get('/get', [auth], characterController.get)

module.exports = router