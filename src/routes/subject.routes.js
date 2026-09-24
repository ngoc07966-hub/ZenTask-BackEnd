const express = require('express')
const router = express.Router()
const subjectController = require('../controllers/subject.controller')
const authMiddleware = require('../middlewares/auth.middleware')

router.post('/', authMiddleware, subjectController.taoSubject)

module.exports = router
