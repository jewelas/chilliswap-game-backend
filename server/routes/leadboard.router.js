const router = require('express').Router()
const auth = require("../middleware/auth");
const leadboard = require('../controllers/leadboard.controllers')

//Retrieve a tournament 
router.get('/:tournamentId', [auth], leadboard.get)

module.exports = router