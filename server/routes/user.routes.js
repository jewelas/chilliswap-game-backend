const router = require('express').Router()
const auth = require("../middleware/auth");
const userController = require('../controllers/user.controllers')

router.get('/address/:publicAddress', userController.getUser)
router.get('/getProfile', auth, userController.get)
router.post('/profile/edit', auth, userController.patch)
router.get('/get_swap_chillies', auth, userController.getswapchillies)

module.exports = router