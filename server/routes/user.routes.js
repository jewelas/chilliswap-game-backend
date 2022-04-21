const router = require('express').Router()
const auth = require("../middleware/auth");
const userController = require('../controllers/user.controllers')


// need to authozied
router.get('/address/:publicAddress', userController.getUser)
router.get('/getProfile', auth, userController.get)

router.post('/profile/edit', auth, userController.patch)


module.exports = router