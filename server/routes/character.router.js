const router = require('express').Router()
const auth = require("../middleware/auth");
const characterController = require('../controllers/character.controllers')

router.post('/set',[auth], characterController.set)
router.get('/get', [auth], characterController.get)

module.exports = router