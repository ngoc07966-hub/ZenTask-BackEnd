const express = require('express')
const router = express.Router()
const homeController = require('../controllers/home.controller')
const authmiddleware = require('../middlewares/auth.middleware')
// chứa đường dẫn API
router.get('/home', authmiddleware, homeController.getHome)
module.exports = router