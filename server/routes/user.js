const router = require('express').Router()
const jwt = require('express-jwt');
const { config } = require('../config/jwt');

const userController = require('../controllers/user')



router.get('/address/:publicAddress', userController.getUser)

router.get('/creators/', userController.getCreators)

//router.post('/get/creator/', userController.getCreatorByUsername)

router.post('/get/user/', userController.getByUsername)

router.post('/creator/search/', userController.searchCreatorByString)


// need to authozied
router.get('/:userId', jwt(config), userController.get)

router.post('/profile/edit', jwt(config), userController.patch)

router.post('/verify/twitter', jwt(config), userController.verifyTwiiter)

router.post('/follow/creator', jwt(config), userController.followCreator)


module.exports = router