const express = require('express')
const router = express.Router()
const lichhocController = require('../controllers/lichhoc.controller')
const authMiddleware = require('../middlewares/auth.middleware')
router.post('/:idSubject', authMiddleware, lichhocController.taoLich)
router.get('/:ngay', authMiddleware, lichhocController.xemLich)
router.patch('/:idDanY/hoanthanh', authMiddleware, lichhocController.danhDauHoanThanh)
module.exports = router