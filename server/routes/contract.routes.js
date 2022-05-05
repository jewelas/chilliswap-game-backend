const router = require('express').Router()
const contractController = require('../controllers/contract.controllers')

router.post('/getNftList', contractController.getNftList)

module.exports = router