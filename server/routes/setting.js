const router = require('express').Router()
const jwt = require('express-jwt');
const { config } = require('../config/jwt');

const settingController = require('../controllers/setting')

router.get('/get/category', settingController.getCategory)


module.exports = router