const express = require('express')
const router = express.Router()
const homeController = require('../controllers/home.controller')
const authmiddleware = require('../middlewares/auth.middleware')

router.get('/', authmiddleware, homeController.getHome)

module.exports = router