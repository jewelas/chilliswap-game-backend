const router = require('express').Router()
const auth = require("../middleware/auth");
const tournamentController = require('../controllers/tournament.controllers')

router.post('/add',[auth], tournamentController.add)
router.post('/edit',[auth], tournamentController.edit)
router.get('/get', [auth], tournamentController.get)

module.exports = router