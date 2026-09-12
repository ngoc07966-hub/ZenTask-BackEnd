const express = require('express')
const cors = require('cors')
// khởi tạo ứng dụng nhận các request
const app = express()
//sử dụng tên miền được phép gọi API mà không bị trình duyệt chặn
app.use(cors())
//cho phép gửi dưới dạng Json
app.use(express.json())
app.get('/health', (req,res) => {
    res.json({message: 'Server is running'})
})
app.use('/api', require('./routes'))
module.exports = app