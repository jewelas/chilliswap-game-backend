const router = require('express').Router()


const authController = require('../controllers/auth')

router.post('/', authController.create)

module.exports = router