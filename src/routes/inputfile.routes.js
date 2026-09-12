// Logic: 
//Android gửi lên 1 file (ảnh/PDF) kèm token, cần server: xác thực người gửi → nhận file → xử lý AI → trả về kết quả.
const express = require('express')
const router = express.Router()
const inputfileController = require('../controllers/inputfile.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const uploadMiddleware = require('../middlewares/upload.middleware')
router.post('/process', authMiddleware, uploadMiddleware.single('file'), inputfileController.process)
module.exports = router