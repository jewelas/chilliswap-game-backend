const router = require('express').Router()
const settingController = require('../controllers/setting')
router.get('/get/category', settingController.getCategory)
module.exports = router