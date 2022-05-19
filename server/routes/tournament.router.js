const router = require('express').Router()
const auth = require("../middleware/auth");
const validateMiddleware =require('../middleware/validateMiddleware')
const tournamentController = require('../controllers/tournament.controllers')
const validate = require('../validations/tournament.validate')

// Create 
router.post('/', [auth, validateMiddleware(validate) ], tournamentController.create)
// Retrieve all 
router.get('/', [auth], tournamentController.findAll)
//Retrieve a single 
router.get('/findOne/:id', [auth], tournamentController.findOne)
//update a single 
router.put('/:id', [auth, validateMiddleware(validate)], tournamentController.update)
//remove a single 
router.delete('/:id', [auth], tournamentController.delete)

router.get('/joined', [auth], tournamentController.joined)

router.get('/notJoined', [auth], tournamentController.notJoined)

router.post('/join', [auth], tournamentController.join)


module.exports = router