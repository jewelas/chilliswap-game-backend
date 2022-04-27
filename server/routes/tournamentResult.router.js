const router = require('express').Router()
const auth = require("../middleware/auth");
const validateMiddleware =require('../middleware/validateMiddleware')
const tournamentResult = require('../controllers/tournamentResult.controllers')
const validate = require('../validations/tournament.result.validate')

// Create 
router.post('/', [auth, validateMiddleware(validate.create) ], tournamentResult.create)
// Retrieve all 
router.get('/', [auth], tournamentResult.findAll)
//Retrieve a single 
router.get('/:id', [auth], tournamentResult.findOne)
//update a single 
router.put('/:id', [auth, validateMiddleware(validate.update)], tournamentResult.update)
//remove a single 
router.delete('/:id', [auth], tournamentResult.delete)

module.exports = router