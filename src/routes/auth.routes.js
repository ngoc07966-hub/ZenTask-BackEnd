const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth.controller')
const authmiddleware = require('../middlewares/auth.middleware')
router.get('/', authmiddleware, authController)
module.exports = router